import requests
import base64
from tempfile import NamedTemporaryFile 
from django.core.files import File
# Django + DRF
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User

from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

from django_filters.rest_framework import DjangoFilterBackend

# Simple JWT
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated

# Your App Models and Serializers
from .models import Doctor, OCTImage, AnalysisResult, Review
from .serializers import (
    DoctorSignupSerializer, DoctorProfileSerializer, DoctorCompleteSerializer,
    CustomTokenObtainPairSerializer, OCTImageSerializer, OCTImageCreateSerializer,
    OCTImageDetailSerializer, AnalysisResultSerializer, AnalysisResultDetailSerializer,
    ReviewSerializer, ReviewCreateSerializer, PublicReviewSerializer
)


class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        if hasattr(obj, 'doctor'):
            return obj.doctor.user == request.user
        elif hasattr(obj, 'oct_image'):
            return obj.oct_image.doctor.user == request.user
        elif hasattr(obj, 'analysis_result'):
            return obj.analysis_result.oct_image.doctor.user == request.user
        return False

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class DoctorViewSet(viewsets.ModelViewSet):
    queryset = Doctor.objects.all()
    parser_classes = (JSONParser, MultiPartParser, FormParser)
    
    def get_permissions(self):
        if self.action == 'signup' or self.action == 'login':
            return [permissions.AllowAny()]
        elif self.action in ['list', 'retrieve']:
            return [permissions.IsAuthenticated()]
        return [permissions.IsAuthenticated()]
    
    def get_serializer_class(self):
        if self.action == 'signup':
            return DoctorSignupSerializer
        elif self.action == 'me' or self.action == 'update_profile':
            return DoctorProfileSerializer
        return DoctorCompleteSerializer
    
    @action(detail=False, methods=['post'])
    def signup(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        doctor = Doctor.objects.get(user=user)
        profile_picture_url = doctor.profile_picture.url if doctor.profile_picture else None
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'doctor': {
                    'hospital': doctor.hospital,
                    'specialty': doctor.specialty,
                    'role': doctor.role,
                    'license_number': doctor.license_number,
                    'profile_picture': profile_picture_url,
                    'phone_number': doctor.phone_number
                }
            }
        }, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def me(self, request):
        doctor = Doctor.objects.get(user=request.user)
        serializer = DoctorCompleteSerializer(doctor)
        return Response(serializer.data)
    
    @action(detail=False, methods=['put', 'patch'], permission_classes=[IsAuthenticated])
    def update_profile(self, request):
        user = request.user
        try:
            doctor = Doctor.objects.get(user=user)
            
            # Print received data for debugging
            print("Received data:", request.data)
            
            # Extract doctor data from the nested structure if present
            doctor_data = {}
            if 'doctor' in request.data and isinstance(request.data['doctor'], dict):
                # Extract doctor data from the nested structure
                doctor_data = request.data['doctor']
            else:
                # Assume data is directly in the request
                doctor_data = request.data
            
            # Update doctor fields
            serializer = DoctorProfileSerializer(doctor, data=doctor_data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            
            # Update user fields if present
            if 'first_name' in request.data:
                user.first_name = request.data['first_name']
            if 'last_name' in request.data:
                user.last_name = request.data['last_name'] 
            if 'email' in request.data:
                user.email = request.data['email']
            user.save()
            
            # Return complete updated data
            return Response(DoctorCompleteSerializer(doctor).data)
            
        except Doctor.DoesNotExist:
            return Response({"error": "Doctor profile not found"}, status=404)
        except Exception as e:
            import traceback
            traceback.print_exc()  # Print stack trace for debugging
            return Response({"error": str(e)}, status=500)



def run_ai_analysis(image_path):
    try:
        api_url = "http://localhost:5000/predict"
        with open(image_path, "rb") as img_file:
            img_data = base64.b64encode(img_file.read()).decode('utf-8')

        payload = {"image_data": img_data}
        response = requests.post(api_url, json=payload)

        if response.status_code == 200:
            result = response.json()
            if not result.get("analyzed_image"):
                print("Flask response missing analyzed image:", result)
                return {
                    'category': 'error',
                    'text': result.get('text', 'No analyzed image returned'),
                    'image_path': image_path
                }

            analyzed_img_data = base64.b64decode(result["analyzed_image"])
            temp_img = NamedTemporaryFile(delete=False, suffix='.png')
            temp_img.write(analyzed_img_data)
            temp_img.flush()
            temp_img.close()

            return {
                'category': result["category"],
                'text': result["text"],
                'image_path': temp_img.name
            }

        print(f"API failed: {response.status_code}, {response.text}")
        return {
            'category': 'error',
            'text': f'API returned error {response.status_code}: {response.text}',
            'image_path': image_path
        }

    except Exception as e:
        print(f"Exception in run_ai_analysis: {str(e)}")
        return {
            'category': 'error',
            'text': f'Exception: {str(e)}',
            'image_path': image_path
        }


class OCTImageViewSet(viewsets.ModelViewSet):
    queryset = OCTImage.objects.all()
    parser_classes = (MultiPartParser, FormParser, JSONParser)
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['custom_id']
    ordering_fields = ['upload_date']
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.IsAuthenticated()]
        return [permissions.IsAuthenticated(), IsOwnerOrReadOnly()]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return OCTImageCreateSerializer
        elif self.action == 'retrieve':
            return OCTImageDetailSerializer
        return OCTImageSerializer
    
    def get_queryset(self):
        if self.request.user.is_authenticated:
            doctor = Doctor.objects.get(user=self.request.user)
            return OCTImage.objects.filter(doctor=doctor)
        return OCTImage.objects.none()

    def perform_create(self, serializer):
        doctor = Doctor.objects.get(user=self.request.user)
        oct_image = serializer.save(doctor=doctor)
        
        # Call AI model for analysis and create AnalysisResult
        ai_result = run_ai_analysis(oct_image.image_file.path)
        analysis_result = AnalysisResult.objects.create(
            oct_image=oct_image,
            
            classification=ai_result['category'],
            findings=ai_result['text'],
        )

        if ai_result.get('image_path'):
            # Open the file explicitly and save it
            with open(ai_result['image_path'], 'rb') as f:
                analysis_result.analysis_image.save(
                    f"processed_{oct_image.id}.png",
                    File(f),
                    save=True
                )
            
            # Clean up temporary file if it was created by us
            if ai_result['image_path'] != oct_image.image_file.path:
                try:
                    os.remove(ai_result['image_path'])
                except:
                    pass

        # Ensure the response contains `id`
        self.response = OCTImageDetailSerializer(oct_image).data

class AnalysisResultViewSet(viewsets.ModelViewSet):
    queryset = AnalysisResult.objects.all()
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['classification']
    ordering_fields = ['analysis_date']
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'by_image']:
            return [permissions.IsAuthenticated()]
        return [permissions.IsAuthenticated(), IsOwnerOrReadOnly()]
    
    def get_serializer_class(self):
        if self.action == 'retrieve' or self.action == 'by_image':
            return AnalysisResultDetailSerializer
        return AnalysisResultSerializer

    def get_queryset(self):
        if self.request.user.is_authenticated:
            doctor = Doctor.objects.get(user=self.request.user)
            return AnalysisResult.objects.filter(oct_image__doctor=doctor)
        return AnalysisResult.objects.none()

    @action(detail=False, methods=['get'], url_path='by-image/(?P<oct_image_id>[0-9a-f-]+)', permission_classes=[IsAuthenticated])
    def by_image(self, request, oct_image_id=None):
        doctor = Doctor.objects.get(user=request.user)
        try:
            analysis = AnalysisResult.objects.get(oct_image__id=oct_image_id, oct_image__doctor=doctor)
            serializer = self.get_serializer(analysis)
            return Response(serializer.data)
        except AnalysisResult.DoesNotExist:
            return Response({'error': 'Analysis result not found for this image.'}, status=404)
        
class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all().order_by('-review_date')
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['analysis_result']
    ordering_fields = ['review_date', 'rating']
    permission_classes = [IsOwnerOrReadOnly]

    def get_serializer_class(self):
        if self.action == 'create':
            return ReviewCreateSerializer
        return ReviewSerializer

    def perform_create(self, serializer):
        doctor = self.request.user.doctor
        serializer.save(doctor=doctor)

    def perform_update(self, serializer):
        serializer.save()
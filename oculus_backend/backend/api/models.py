from django.db import models
from django.contrib.auth.models import User
import uuid

class Doctor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    hospital = models.CharField(max_length=100, blank=True, null=True)
    specialty = models.CharField(max_length=100, blank=True, null=True)
    role = models.CharField(max_length=100, default='general')
    license_number = models.CharField(max_length=50, blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)
    phone_number = models.IntegerField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.specialty}"

class OCTImage(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='oct_images')
    image_file = models.ImageField(upload_to='oct_images/')
    upload_date = models.DateTimeField(auto_now_add=True)
    custom_id = models.CharField(max_length=50, blank=True, null=True)
    
    def __str__(self):
        return f"OCT Image {self.custom_id or self.id} by Dr. {self.doctor.user.last_name}"

class AnalysisResult(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    oct_image = models.OneToOneField(OCTImage, on_delete=models.CASCADE, related_name='analysis_result')
    classification = models.CharField(max_length=100)
    findings = models.TextField()
    analysis_image = models.ImageField(upload_to='analysis_images/', blank=True, null=True)
    analysis_date = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Analysis for {self.oct_image.custom_id or self.oct_image.id} - {self.classification}"



class Review(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    analysis_result = models.ForeignKey(
        'AnalysisResult',  # Replace with your actual related model name
        on_delete=models.CASCADE,
        related_name='reviews',
        null=True,
        blank=True
    )
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='reviews')
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    comments = models.TextField()
    review_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review by Dr. {self.doctor.user.last_name} on {self.analysis_result}"
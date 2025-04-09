import os

from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
# BASE_DIR = Path(__file__).resolve().parent.parent



# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-l9h-65bq(4j%nwc2^zuy6*k!_@t=(s=*m%@%@c%kq!6996va*0'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = [ '*' ]

BASE_DIR = Path(__file__).resolve().parent.parent
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django_filters',
     'rest_framework',           # Django REST Framework
    'corsheaders', 
    'rest_framework_simplejwt',             # Cross-Origin Resource Sharing
    
    # Local apps
    'api',                 # Our authenticationkc app

]
AUTH_USER_MODEL = 'auth.User'


# REST Framework settings
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    # NEW: Add parser classes to handle different types of request data
    'DEFAULT_PARSER_CLASSES': [
        'rest_framework.parsers.JSONParser',       # For JSON data
        'rest_framework.parsers.FormParser',       # For form data
        'rest_framework.parsers.MultiPartParser',  # For file uploads
    ],
}


from datetime import timedelta

# JWT settings
SIMPLE_JWT = {
    # Access token expires after 1 hour
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),
    # Refresh token expires after 14 days
    'REFRESH_TOKEN_LIFETIME': timedelta(days=14),
    # Generate new refresh token when used
    'ROTATE_REFRESH_TOKENS': True,
    # Invalidate old refresh tokens when new ones are created
    'BLACKLIST_AFTER_ROTATION': True,
    # Don't update last_login time
    'UPDATE_LAST_LOGIN': False,
    # JWT encryption algorithm
    'ALGORITHM': 'HS256',
    # Key used for signing tokens (use Django's SECRET_KEY)
    'SIGNING_KEY': 'YOUR_SECRET_KEY',  # Replace with your Django SECRET_KEY
    'VERIFYING_KEY': None,
    # HTTP header prefix for Authorization header
    'AUTH_HEADER_TYPES': ('Bearer',),
    # User ID field in the User model
    'USER_ID_FIELD': 'id',
    # User ID claim in the token payload
    'USER_ID_CLAIM': 'user_id',
    # Token class
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    # Token type claim in the payload
    'TOKEN_TYPE_CLAIM': 'token_type',
}


# Add these comprehensive CORS settings
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True
CORS_EXPOSE_HEADERS = ['Content-Type', 'X-CSRFToken']
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]
CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
] # Temporary for development
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
CORS_ALLOW_CREDENTIALS = True                       # Important for session cookies

# Session settings
SESSION_COOKIE_SECURE = False                          # Only send cookie over HTTPS
SESSION_COOKIE_HTTPONLY = False                     # Prevent JavaScript access to session cookie
SESSION_COOKIE_SAMESITE = 'Lax'

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',  # Move this line up
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.1/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


# Password validation
# https://docs.djangoproject.com/en/5.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.1/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/5.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

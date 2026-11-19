"""
Django settings for quickcheckout project.
QUICKCHECKOUT 2.0 - SHOP. SCAN. PAY. GO.
"""

import os
from pathlib import Path
from dotenv import load_dotenv

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Load .env file
load_dotenv(BASE_DIR / '.env')

SECRET_KEY = os.getenv('DJANGO_SECRET_KEY', 'qc2-super-secret-key-production-ready-retailtech-2026')

DEBUG = os.getenv('DJANGO_DEBUG', 'True') == 'True'

allowed_hosts_raw = os.getenv('ALLOWED_HOSTS', '*')
if allowed_hosts_raw == '*':
    ALLOWED_HOSTS = ['*']
else:
    ALLOWED_HOSTS = [h.strip() for h in allowed_hosts_raw.split(',') if h.strip()]

# Application definition
INSTALLED_APPS = [
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # Third party apps
    'corsheaders',
    'rest_framework',
    # QuickCheckout apps
    'api',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'quickcheckout.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'quickcheckout.wsgi.application'

# Native Django ORM sqlite3 used only for Django internal session/auth tables if invoked,
# MongoDB (PyMongo) is the actual core application database for all products, carts, orders, transactions, users!
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Password validation
AUTH_PASSWORD_VALIDATORS = []

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Asia/Kolkata'
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# CORS configuration
from corsheaders.defaults import default_headers

# Set to True by default or if 'True' in .env (allows any Vercel domain or local dev)
CORS_ALLOW_ALL_ORIGINS = os.getenv('CORS_ALLOW_ALL_ORIGINS', 'True').lower() in ('true', '1', 'yes', 't')
CORS_ALLOW_CREDENTIALS = True

# Specific allowed origins from .env (comma-separated, e.g. https://your-site.vercel.app,http://localhost:3454)
cors_origins_raw = os.getenv('CORS_ALLOWED_ORIGINS', '')
if cors_origins_raw:
    CORS_ALLOWED_ORIGINS = [origin.strip() for origin in cors_origins_raw.split(',') if origin.strip()]
else:
    CORS_ALLOWED_ORIGINS = [
        "http://localhost:3454",
        "http://127.0.0.1:3454",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]

# Regex pattern to automatically permit all Vercel domains (e.g., your-app.vercel.app & preview branches)
CORS_ALLOWED_ORIGIN_REGEXES = [
    r"^https:\/\/.*\.vercel\.app$",
]

# CSRF trusted origins for secure POST/PUT/DELETE requests across domains
csrf_origins_raw = os.getenv('CSRF_TRUSTED_ORIGINS', '')
if csrf_origins_raw:
    CSRF_TRUSTED_ORIGINS = [origin.strip() for origin in csrf_origins_raw.split(',') if origin.strip()]
else:
    CSRF_TRUSTED_ORIGINS = [
        "http://localhost:3454",
        "http://127.0.0.1:3454",
        "https://*.vercel.app",
        "https://*.onrender.com",
    ]

CORS_ALLOW_HEADERS = list(default_headers) + [
    'x-session-id',
    'x-requested-with',
    'authorization',
    'content-type',
    'accept',
    'origin',
    'user-agent',
]

CORS_EXPOSE_HEADERS = [
    'content-type',
    'x-session-id',
]

# REST Framework configuration
REST_FRAMEWORK = {
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ],
    'DEFAULT_PARSER_CLASSES': [
        'rest_framework.parsers.JSONParser',
        'rest_framework.parsers.FormParser',
        'rest_framework.parsers.MultiPartParser',
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'quickcheckout.jwt_auth.JWTAuthentication',
    ],
    'UNAUTHENTICATED_USER': None,
}

# MongoDB Atlas Configuration
MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/')
MONGODB_DB_NAME = os.getenv('MONGODB_DB_NAME', 'quickcheckout_db')

# JWT Configuration
JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'qc2-jwt-token-signing-secret-super-secure-2026')
JWT_ALGORITHM = 'HS256'
JWT_EXPIRATION_HOURS = 72

# Razorpay Configuration
RAZORPAY_KEY_ID = os.getenv('RAZORPAY_KEY_ID', 'rzp_test_qc2supermarket')
RAZORPAY_KEY_SECRET = os.getenv('RAZORPAY_KEY_SECRET', 'qc2secret_razorpay_key_2026')

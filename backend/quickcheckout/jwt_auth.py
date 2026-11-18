"""
JWT Authentication Utility and DRF Authentication Class.
Handles secure token generation, validation, and user resolution from MongoDB.
"""

import jwt
import hashlib
import os
import datetime
from rest_framework import authentication, exceptions
from django.conf import settings
from quickcheckout.mongo import get_db

SECRET_KEY = getattr(settings, 'JWT_SECRET_KEY', 'qc2-jwt-token-signing-secret-super-secure-2026')
ALGORITHM = getattr(settings, 'JWT_ALGORITHM', 'HS256')

def hash_password(password: str) -> str:
    """Hash password using SHA-256 with salt."""
    salt = "quickcheckout_salt_2026"
    return hashlib.sha256(f"{salt}{password}".encode('utf-8')).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return hash_password(plain_password) == hashed_password

def generate_tokens(user_data: dict) -> dict:
    """Generate access and refresh tokens for user."""
    payload = {
        'user_id': str(user_data.get('_id') or user_data.get('id', '')),
        'email': user_data.get('email', ''),
        'name': user_data.get('name', ''),
        'role': user_data.get('role', 'customer'),
        'exp': datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=getattr(settings, 'JWT_EXPIRATION_HOURS', 72)),
        'iat': datetime.datetime.now(datetime.timezone.utc)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return {
        'token': token,
        'user': {
            'id': payload['user_id'],
            'email': payload['email'],
            'name': payload['name'],
            'role': payload['role']
        }
    }

def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise exceptions.AuthenticationFailed('Token has expired')
    except jwt.InvalidTokenError:
        raise exceptions.AuthenticationFailed('Invalid token')

class JWTUser:
    """Lightweight user object conforming to Django / DRF requirements."""
    def __init__(self, data):
        self.data = data
        self.id = data.get('user_id') or data.get('id')
        self.pk = self.id
        self.email = data.get('email')
        self.name = data.get('name')
        self.role = data.get('role', 'customer')
        self.is_authenticated = True
        self.is_staff = (self.role == 'admin')
        self.is_superuser = (self.role == 'admin')

    def __str__(self):
        return f"{self.name} ({self.email})"

class JWTAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return None

        parts = auth_header.split()
        if len(parts) != 2 or parts[0].lower() != 'bearer':
            return None

        token = parts[1]
        try:
            payload = decode_token(token)
        except Exception as e:
            raise exceptions.AuthenticationFailed(str(e))

        user = JWTUser(payload)
        return (user, token)

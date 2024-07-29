# serializers.py
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Worker
from .serializers import ProvidersSerializer  # Import your existing ProvidersSerializer

User = get_user_model()

class CustomUserSerializer(serializers.ModelSerializer):
    worker = ProvidersSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'worker']

# # serializers.py
# from rest_framework import serializers
# from django.contrib.auth import get_user_model
# from .models import Worker
# from .serializers import CategorySerializer, ProvidersSerializer  # Import your existing ProvidersSerializer

# User = get_user_model()

# class CustomUserSerializer(serializers.ModelSerializer):
#     worker = ProvidersSerializer(read_only=True)
#     categories = CategorySerializer(many=True, read_only=True)
#     extra_images = serializers.ListField(child=serializers.ImageField(), write_only=True, required=False)


#     class Meta:
#         model = User
#         fields = ['id', 'email', 'first_name', 'last_name', 'worker', 'extra_images','categories']

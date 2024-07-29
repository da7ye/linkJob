from django.contrib.auth import get_user_model
from rest_framework.serializers import ModelSerializer
from .models import Category, Worker
from djoser.serializers import UserCreateSerializer
from djoser.serializers import UserSerializer as DjoserUserSerializer
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated




User = get_user_model()


class CreateWorkerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Worker
        fields = ['categories', 'rating', 'pricePerHour', 'gender', 'profile_photo', 'num_tel', 'small_description', 'description']

    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user
        # Extraire les catégories des données validées
        categories = validated_data.pop('categories', [])
        # Créer l'instance de Worker sans les catégories
        worker = Worker.objects.create(user=user, **validated_data)
        # Assigner les catégories à l'instance Worker
        worker.categories.set(categories)
        return worker

class UpdateWorkerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Worker
        fields = ['categories', 'rating', 'pricePerHour', 'gender', 'profile_photo', 'num_tel', 'small_description', 'description']

    def update(self, instance, validated_data):
        categories = validated_data.pop('categories', [])
        instance = super().update(instance, validated_data)
        instance.categories.set(categories)
        return instance




class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name']

class WorkerSerializer(serializers.ModelSerializer):
    
    user = UserSerializer()  # Serialize user details

    class Meta:
        model = Worker
        fields = '__all__' 

class ProvidersSerializer(ModelSerializer):
    user = UserSerializer()  

    class Meta:
        model = Worker
        fields = '__all__'



class CategorySerializer(ModelSerializer):
    # workers = ProvidersSerializer(many=True, read_only=True)

    class Meta:
        model = Category
        fields = '__all__'

class CustomUserSerializer(DjoserUserSerializer):
    worker = WorkerSerializer(read_only=True)
    categories = CategorySerializer(many=True, read_only=True)

    class Meta(DjoserUserSerializer.Meta):
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'worker', 'categories']


class CreateUserSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'password']
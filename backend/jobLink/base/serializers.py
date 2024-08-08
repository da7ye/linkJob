from django.contrib.auth import get_user_model
from rest_framework.serializers import ModelSerializer
from .models import Category, Language, Review, Worker, ExtraImage, Education
from djoser.serializers import UserCreateSerializer
from djoser.serializers import UserSerializer as DjoserUserSerializer
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated




User = get_user_model()



class CreateWorkerSerializer(serializers.ModelSerializer):
    extra_images = serializers.ListField(child=serializers.ImageField(), write_only=True, required=False)

    class Meta:
        model = Worker
        fields = ['categories', 'rating', 'pricePerHour', 'gender', 'profile_photo', 'num_tel', 'small_description', 'description', 'extra_images']

    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user
        
        # Extract categories and extra_images from validated_data
        categories = validated_data.pop('categories', [])
        extra_images = validated_data.pop('extra_images', [])
        
        # Create Worker instance without categories and extra_images
        worker = Worker.objects.create(user=user, **validated_data)
        
        # Set categories for Worker instance
        worker.categories.set(categories)
        print(f"Extra images received: {extra_images}")  # Debug print

        
        # Create ExtraImage instances and associate them with the Worker
        for image in extra_images:
            ExtraImage.objects.create(worker=worker, image=image)
        
        return worker

class ExtraImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExtraImage
        fields = '__all__'

class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = '__all__'

class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = '__all__'

class UpdateWorkerSerializer(serializers.ModelSerializer):
    extra_images = ExtraImageSerializer(many=True, read_only=True)
    class Meta:
        model = Worker
        fields = ['categories', 'rating', 'pricePerHour', 'gender', 'profile_photo', 'num_tel', 'small_description', 'description', 'extra_images']

    def update(self, instance, validated_data):
        categories = validated_data.pop('categories', [])
        extra_images = validated_data.pop('extra_images', [])
        
        # Update instance fields
        instance = super().update(instance, validated_data)
        
        # Update categories
        instance.categories.set(categories)

        # Handle extra images
        if extra_images:
            # Remove existing extra images
            instance.extra_images.all().delete()
            
            # Add new extra images
            for image in extra_images:
                ExtraImage.objects.create(worker=instance, image=image)

        return instance



class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name']





# class WorkerSerializer(serializers.ModelSerializer):
    
#     user = UserSerializer()  # Serialize user details
#     extra_images = ExtraImageSerializer(many=True, read_only=True)


#     class Meta:
#         model = Worker
#         fields = '__all__' 

class CategorySerializer(ModelSerializer):
    # workers = ProvidersSerializer(many=True, read_only=True)

    class Meta:
        model = Category
        fields = '__all__'


class ProvidersSerializer(ModelSerializer):
    reviews = serializers.SerializerMethodField(read_only= True)
    user = UserSerializer()  
    educations = EducationSerializer(many=True, read_only=True)
    extra_images = ExtraImageSerializer(many=True, read_only=True)
    languages = LanguageSerializer(many=True, read_only=True)
    categories = CategorySerializer(many=True, read_only=True)
    class Meta:
        model = Worker
        fields = '__all__'
    
    def get_reviews(self,obj):
        reviews = obj.review_set.all()
        serializer = ReviewSerializer(reviews,many=True)
        return serializer.data


class CustomUserSerializer(DjoserUserSerializer):
    worker = ProvidersSerializer(read_only=True)

    class Meta(DjoserUserSerializer.Meta):
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'worker']

    

class CreateUserSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'password']


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'
from unicodedata import category
from django.contrib.auth import get_user_model
from rest_framework.serializers import ModelSerializer
from .models import Category, Job, JobComment, Language, Review, Worker, WorkerExtraImage,JobExtraImage, Education
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
        fields = ['categories', 'rating', 'price','payment_type', 'gender', 'profile_photo', 'num_tel', 'small_description', 'description', 'extra_images']

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
            WorkerExtraImage.objects.create(worker=worker, image=image)
        
        return worker

class WorkerExtraImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkerExtraImage
        fields = '__all__'

class JobExtraImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobExtraImage
        fields =  ['image']

class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = '__all__'

class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = '__all__'

class UpdateWorkerSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='user.first_name', required=False)
    last_name = serializers.CharField(source='user.last_name', required=False)
    extra_images = WorkerExtraImageSerializer(many=True, read_only=True)

    class Meta:
        model = Worker
        fields = [
            'categories', 'rating', 'price', 'payment_type', 'gender', 
            'profile_photo', 'num_tel', 'small_description', 'description', 
            'extra_images', 'first_name', 'last_name'
        ]

    def update(self, instance, validated_data):
        # Extract user data
        user_data = validated_data.pop('user', {})
        first_name = user_data.get('first_name')
        last_name = user_data.get('last_name')

        # Update the Worker instance fields
        instance = super().update(instance, validated_data)

        # Update the associated User model fields
        if first_name:
            instance.user.first_name = first_name
        if last_name:
            instance.user.last_name = last_name
        instance.user.save()

        return instance




class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name']




class CategorySerializer(ModelSerializer):
    # workers = ProvidersSerializer(many=True, read_only=True)

    class Meta:
        model = Category
        fields = '__all__'


class JobSerializer(serializers.ModelSerializer):
    job_extra_images = JobExtraImageSerializer(many=True, read_only=True)
    # Using serializers.ListField with child=serializers.ImageField() directly on the extra_images 
    # field ensures that Django's REST framework understands that this field expects a list of 
    # image files. This matches the structure you're sending from the frontend.
    extra_images = serializers.ListField(
        child=serializers.ImageField(), required=False
    )

    employer = UserSerializer(read_only=True)  
    class Meta:

        model = Job
        fields = [
            'id', 'title', 'description', 'more_details', 'location',
            'payment_expected', 'categories_interested', 'num_tel',
            'speaked_luanguages', 'payment_type', 'tools_needed', 'extra_images',
            'date_posted','job_extra_images','employer' 
        ]

    def create(self, validated_data):
        # Extract extra_images data from the validated data before creating the job
        extra_images_data = validated_data.pop('extra_images', [])
        categories = validated_data.pop('categories_interested', [])

        # Create the job object
        job = Job.objects.create(
            # Get the employer from the context
            employer=self.context['request'].user, 
            **validated_data
        )
        # Set the categories after the job is created
        job.categories_interested.set(categories)

        # Save the extra images associated with the job
        for image in extra_images_data:
            JobExtraImage.objects.create(job=job, image=image)

        return job




class ProvidersSerializer(ModelSerializer):
    reviews = serializers.SerializerMethodField(read_only= True)
    user = UserSerializer()  
    educations = EducationSerializer(many=True, read_only=True)
    extra_images = WorkerExtraImageSerializer(many=True, read_only=True)
    languages = LanguageSerializer(many=True, read_only=True)
    categories = CategorySerializer(many=True, read_only=True)
    class Meta:
        model = Worker
        fields = '__all__'
    
    def get_reviews(self,obj):
        reviews = obj.review_set.all()
        serializer = ReviewSerializer(reviews,many=True)
        return serializer.data

# comment on a job by worker
class JobCommentSerializer(serializers.ModelSerializer):
    commentator = ProvidersSerializer(read_only=True)
    class Meta:
        model = JobComment
        fields = '__all__'


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
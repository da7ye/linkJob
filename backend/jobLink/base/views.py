from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Category, Review, Worker
from .serializers import CategorySerializer, CreateWorkerSerializer, ProvidersSerializer, CustomUserSerializer, UpdateWorkerSerializer
from rest_framework import status
from rest_framework.views import APIView


@api_view(['GET'])
def getRoutes(request):
    routes = [
        'GET /api',
        'GET /api/categories',
        'GET /api/categoryProviders/:id',
        'GET /api/workers',
        'GET /api/workers/:id',
        'GET /api/<str:pk>/reviews/'
    ]
    return Response(routes)

# @api_view(['GET'])
# def check_if_worker(request):
#     user = request.user
#     try:
#         Worker.objects.get(user=user)
#         return Response({'is_worker': True}, status=status.HTTP_200_OK)
#     except Worker.DoesNotExist:
#         return Response({'is_worker': False}, status=status.HTTP_200_OK)

class BecomeWorkerView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CreateWorkerSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# view and update worker details:
class WorkerDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        try:
            worker = Worker.objects.get(user=user)
        except Worker.DoesNotExist:
            return Response({'detail': 'Worker not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = UpdateWorkerSerializer(worker)
        return Response(serializer.data)

    def put(self, request):
        user = request.user
        try:
            worker = Worker.objects.get(user=user)
        except Worker.DoesNotExist:
            return Response({'detail': 'Worker not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = UpdateWorkerSerializer(worker, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CustomUserDetailView(generics.RetrieveAPIView):
    
    serializer_class = CustomUserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

@api_view(['GET'])
def getCategories(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def getCategorieProviders(request, pk):
    category = Category.objects.get(_id=pk)
    providers = category.workers.filter(is_active=True)  # Correctly reference the 'workers' related_name
    category_data = CategorySerializer(category).data
    category_data['workers'] = ProvidersSerializer(providers, many=True).data
    return Response(category_data)

@api_view(['GET'])
def getWorkers(request):
    workers = Worker.objects.all()
    serializer = ProvidersSerializer(workers, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def getWorker(request, pk):
    worker = Worker.objects.get(_id=pk)
    serializer = ProvidersSerializer(worker)
    return Response(serializer.data)

# review a worker:
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createWorkerReview(request, pk):
    user = request.user
    worker = Worker.objects.get(_id=pk)
    data = request.data

    # 1. Check if the user is trying to review themselves
    if user == worker.user: 
        content = {'detail': 'You cannot review yourself'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)

    # 2. Check if a review already exists
    alreadyExists = worker.review_set.filter(reviewer=user).exists()

    if alreadyExists:
        content = {'detail': 'Worker already reviewed'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)

    # 3. Check if rating is provided and not zero
    if data.get('rating') == 0:
        content = {'detail': 'Please select a rating'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)

    # 4. Create review
    review = Review.objects.create(
        reviewer=user,
        worker=worker,
        name=user.first_name,
        rating=data['rating'],
        comment=data.get('comment', ''),
    )

    reviews = worker.review_set.all()
    worker.numReviews = len(reviews)

    total = sum(review.rating for review in reviews)
    worker.rating = total / len(reviews)
    worker.save()

    return Response('Review Added')

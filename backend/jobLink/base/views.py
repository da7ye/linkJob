from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Category, Worker
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
    ]
    return Response(routes)

class BecomeWorkerView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CreateWorkerSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# views.py
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
    providers = category.workers.all()  # Correctly reference the 'workers' related_name
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

from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.response import Response
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Category, Job, JobComment, Review, Worker
from .serializers import CategorySerializer, CreateWorkerSerializer, JobCommentSerializer, JobSerializer, ProvidersSerializer, CustomUserSerializer, UpdateWorkerSerializer
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.exceptions import ValidationError
from rest_framework.parsers import MultiPartParser, FormParser



@api_view(['GET'])
def getRoutes(request):
    routes = [
        'GET /api',
        'GET /api/categories',
        'GET /api/jobs',
        'GET /api/categoryProviders/:id',
        'GET /api/workers',
        'GET /api/workers/:id',
        'GET /api/<str:pk>/reviews/'
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
def getJobs(request):
    jobs = Job.objects.all()
    serializer = JobSerializer(jobs, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserJobs(request):
    user = request.user
    jobs = Job.objects.filter(employer=user)
    serializer = JobSerializer(jobs, many=True)
    return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def deleteUserJob(request, job_id):
    try:
        job = Job.objects.get(id=job_id, employer=request.user)
        job.delete()
        return Response({'message': 'Job deleted successfully!'}, status=status.HTTP_204_NO_CONTENT)
    except Job.DoesNotExist:
        return Response({'error': 'Job not found or you are not authorized to delete this job.'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUserJob(request, job_id):
    try:
        job = Job.objects.get(id=job_id, employer=request.user)
    except Job.DoesNotExist:
        return Response({'error': 'Job not found or you are not authorized to update this job.'}, status=status.HTTP_404_NOT_FOUND)

    serializer = JobSerializer(job, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def getJobDetails(request, pk):
    job = Job.objects.get(id=pk)
    Job_data = JobSerializer(job).data

    return Response(Job_data)



@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def createJob(request):
    serializer = JobSerializer(data=request.data, context={'request': request})

    try:
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except ValidationError as e:
        error_messages = {
            field: messages if isinstance(messages, list) else [messages]
            for field, messages in e.detail.items()
        }
        
        return Response({
            "detail": "Validation failed.",
            "errors": error_messages
        }, status=status.HTTP_400_BAD_REQUEST)

# comment on a job:
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createJobComment(request, pk):
    try:
        # Check if the user has a worker model
        worker = request.user.worker
    except AttributeError:
        content = {'detail': 'Only a Worker Can Comment On the Job!'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)
    

    job = Job.objects.get(id=pk)
    data = request.data

    # 1. Check if the user is trying to comment on them self themselves
    if job.employer == worker:
        content = {'detail': 'You cannot comment on yourself'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)

    # 2. Check if a comment already exists
    alreadyExists = JobComment.objects.filter(commentator=worker, job=job).exists()

    if alreadyExists:
        content = {'detail': 'Worker already commented'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)

     
    # 3. Check if a the commenting worker's account is not activated
    if worker.is_active == False:
        content = {'detail': 'Your Worker Account is not activated yet!'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)


    # 3. Create comment:
    comment = JobComment.objects.create(
        commentator=worker,
        job=job,
        name=worker.user.first_name,
        comment=data['comment'],
    )
    # Serialize the comment and return it in the response
    serializer = JobCommentSerializer(comment)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

# @api_view(['PUT'])
# @permission_classes([IsAuthenticated])
# def updateJobComment(request, pk, comment_id):
#     try:
#         comment = JobComment.objects.get(id=comment_id)
#     except JobComment.DoesNotExist:
#         return Response({'detail': 'Comment not found'}, status=status.HTTP_404_NOT_FOUND)
    
#     # Ensure the user is the owner of the comment
#     if comment.commentator != request.user.worker:
#         return Response({'detail': 'You do not have permission to edit this comment'}, status=status.HTTP_403_FORBIDDEN)

#     # Update comment content
#     data = request.data
#     serializer = JobCommentSerializer(comment, data=data, partial=True)

#     if serializer.is_valid():
#         serializer.save()
#         return Response(serializer.data, status=status.HTTP_200_OK)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def getJobComments(request, pk):
    job = Job.objects.get(id=pk)
    comments = JobComment.objects.filter(job=job)
    serializer = JobCommentSerializer(comments, many=True)
    return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def deleteJobComment(request, pk):
    worker = request.user.worker
    try:
        comment = JobComment.objects.get(_id=pk, commentator=worker)
        comment.delete()
        return Response({'detail': 'Comment deleted successfully'}, status=status.HTTP_200_OK)
    except JobComment.DoesNotExist:
        return Response({'detail': 'Comment not found or unauthorized'}, status=status.HTTP_404_NOT_FOUND)




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

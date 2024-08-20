from django.urls import path, re_path
from . import views
from .views import BecomeWorkerView, WorkerDetailView, deleteUserJob, updateUserJob


urlpatterns = [
    path('', views.getRoutes),   
    path('categories/', views.getCategories),
    path('jobs/', views.getJobs),
    path('jobs/postajob/', views.createJob),
    path('userjobs/', views.getUserJobs),
    path('deletejob/<int:job_id>/', deleteUserJob, name='delete-job'),

    path('updatejob/<int:job_id>/', updateUserJob, name='update-job'),


    path('jobs/<str:pk>/', views.getJobDetails),

    path('categoryProviders/<str:pk>/', views.getCategorieProviders),
    path('workers/', views.getWorkers),
    path('workers/<str:pk>/', views.getWorker),
    path('become-worker/', BecomeWorkerView.as_view(), name='become-worker'),
    path('worker-update/', WorkerDetailView.as_view(), name='worker-update'),
    # path('api/check_if_worker/', check_if_worker, name='check_if_worker'),
    
    path('<str:pk>/reviews/',views.createWorkerReview,name="create-review"),
    path('<str:pk>/comments/', views.getJobComments, name="get-comments"),

    path('<str:pk>/postcomment/',views.createJobComment,name="create-comment"),
    # path('comments/<int:comment_id>/update/', views.updateJobComment, name="update-comment"),  # New URL for updating comments

    path('comments/<str:pk>/delete/', views.deleteJobComment, name="delete-comment"),


]
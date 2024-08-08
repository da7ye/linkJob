from django.urls import path, re_path
from . import views
from .views import BecomeWorkerView, WorkerDetailView


urlpatterns = [
    path('', views.getRoutes),   
    path('categories/', views.getCategories),
    path('categoryProviders/<str:pk>/', views.getCategorieProviders),
    path('workers/', views.getWorkers),
    path('workers/<str:pk>/', views.getWorker),
    path('become-worker/', BecomeWorkerView.as_view(), name='become-worker'),
    path('worker-update/', WorkerDetailView.as_view(), name='worker-update'),
    # path('api/check_if_worker/', check_if_worker, name='check_if_worker'),
    
    path('<str:pk>/reviews/',views.createWorkerReview,name="create-review"),

]
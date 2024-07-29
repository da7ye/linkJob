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
    path('worker-detail/', WorkerDetailView.as_view(), name='worker-detail'),

]
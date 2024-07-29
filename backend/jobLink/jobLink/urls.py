from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from base.views import CustomUserDetailView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/auth/", include('djoser.urls')),
    path("api/v1/auth/", include('djoser.urls.jwt')),
    path('api/v1/auth/users/me/', CustomUserDetailView.as_view(), name='user-detail'),
    path('api/', include('base.urls')),
]

urlpatterns+=static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)
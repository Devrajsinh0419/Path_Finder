from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from apps.accounts.views import MyTokenObtainPairView, RegisterView, GoogleAuthView

urlpatterns = [
    path('admin/', admin.site.urls),
    # Auth APIs
    path('api/auth/login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/register/', RegisterView.as_view(), name='register'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/google/', GoogleAuthView.as_view(), name='google_auth'),
    
    # Add this line to include all accounts URLs (including complete-profile)
    path('api/accounts/', include('apps.accounts.urls')),
    
    path('api/academics/', include('apps.academics.urls')),
    path('api/analysis/', include('apps.analysis.urls')),
    path('api/career/', include('apps.ml_engine.urls')),
    path('api/roadmap/', include('apps.roadmap.urls'))
]

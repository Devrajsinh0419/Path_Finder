from django.urls import path
from django.contrib import admin
from django.views.decorators.csrf import csrf_exempt
from .views import RegisterView, CompleteProfileView, UserProfileView, GoogleAuthView

urlpatterns = [
    path('register/', csrf_exempt(RegisterView.as_view()), name='register'),
    path('complete-profile/', CompleteProfileView.as_view(), name='complete-profile'),  
    path("StudentProfile/", CompleteProfileView.as_view()),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('google/', GoogleAuthView.as_view(), name='google-auth'),
]
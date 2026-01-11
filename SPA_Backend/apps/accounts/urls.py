from django.urls import path
from django.views.decorators.csrf import csrf_exempt
from .views import RegisterView
from .views import CompleteProfileView

urlpatterns = [
    path('register/', csrf_exempt(RegisterView.as_view()), name='register'),
    path("complete-profile/", CompleteProfileView.as_view()),
]
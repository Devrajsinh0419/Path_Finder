from django.urls import path
from django.views.decorators.csrf import csrf_exempt
from .views import RegisterView


urlpatterns = [
    path('register/', csrf_exempt(RegisterView.as_view()), name='register'),
]
from django.urls import path
from .views import RoadmapView


urlpatterns = [
    path('generate/', RoadmapView.as_view()),
]
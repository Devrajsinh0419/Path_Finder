from django.urls import path
from .views import PerformanceAnalysisView


urlpatterns = [
path('performance/', PerformanceAnalysisView.as_view()),
]
from django.urls import path
from .views import SemesterResultCreateView, SemesterResultListView


urlpatterns = [
    path('add/', SemesterResultCreateView.as_view()),
    path('my-results/', SemesterResultListView.as_view()),
]
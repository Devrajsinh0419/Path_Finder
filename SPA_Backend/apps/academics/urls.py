from django.urls import path
from .views import SemesterResultCreateView, SemesterResultListView, UploadResultPDFView


urlpatterns = [
    path('add/', SemesterResultCreateView.as_view()),
    path('my-results/', SemesterResultListView.as_view()),
    path("upload-result-pdf/", UploadResultPDFView.as_view(), name="upload-result-pdf"),
]
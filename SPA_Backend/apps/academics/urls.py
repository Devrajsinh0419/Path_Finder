from django.urls import path
from .views import SemesterResultCreateView, SemesterResultListView, StudentProfileView, UploadResultPDFView, StudentAnalysisView, ManualMarksEntryView


urlpatterns = [
    path('student-profile/', StudentProfileView.as_view()),
    path('add/', SemesterResultCreateView.as_view()),
    path('my-results/', SemesterResultListView.as_view()),
    path("upload-result-pdf/", UploadResultPDFView.as_view(), name="upload-result-pdf"),
    path('analysis/', StudentAnalysisView.as_view(), name='student-analysis'),
    path('manual-marks/', ManualMarksEntryView.as_view(), name='manual-marks'),
]
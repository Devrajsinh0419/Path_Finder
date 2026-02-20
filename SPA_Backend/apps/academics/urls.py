from django.urls import path
from .views import SemesterResultCreateView, SemesterResultListView, StudentProfileView, ProctoringEventView, UploadResultPDFView, StudentAnalysisView, ManualMarksEntryView, HealthCheckView


urlpatterns = [
    path('student-profile/', StudentProfileView.as_view()),
    path('proctoring-events/', ProctoringEventView.as_view(), name='proctoring-events'),
    path('add/', SemesterResultCreateView.as_view()),
    path('my-results/', SemesterResultListView.as_view()),
    path("upload-result-pdf/", UploadResultPDFView.as_view(), name="upload-result-pdf"),
    path('analysis/', StudentAnalysisView.as_view(), name='student-analysis'),
    path('manual-marks/', ManualMarksEntryView.as_view(), name='manual-marks'),
    path("health/", HealthCheckView.as_view()),

]

from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import SemesterResult
from .serializers import SemesterResultSerializer
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework import status

from accounts.permissions import IsProfileCompleted
from .services.pdf_extractor import extract_grades_from_pdf
from .services.marks_ingestor import ingest_grades


class SemesterResultCreateView(generics.CreateAPIView):
    serializer_class = SemesterResultSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)


class SemesterResultListView(generics.ListAPIView):
    serializer_class = SemesterResultSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return SemesterResult.objects.filter(student=self.request.user)


class UploadResultPDFView(APIView):
    parser_classes = [MultiPartParser]
    permission_classes = [IsAuthenticated, IsProfileCompleted]

    def post(self, request):
        pdf = request.FILES.get("file")

        if not pdf:
            return Response(
                {"error": "No PDF file uploaded"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            extracted_data = extract_grades_from_pdf(pdf)
            ingest_grades(request.user, extracted_data)

            return Response(
                {"message": "Grade sheet processed successfully"},
                status=status.HTTP_201_CREATED
            )

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

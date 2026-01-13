from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from .models import SemesterResult
from .serializers import SemesterResultSerializer


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

class StudentProfileView(generics.RetrieveAPIView):
    serializer_class = SemesterResultSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        profile_data = {
            "first_name": request.user.first_name,
            "last_name": request.user.last_name,
            "email": request.user.email,
        }
        return Response(profile_data, status=status.HTTP_200_OK)

class UploadResultPDFView(generics.CreateAPIView):
    serializer_class = SemesterResultSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        # Handle PDF upload and parsing logic here
        return Response({"message": "PDF uploaded successfully"}, status=status.HTTP_201_CREATED)

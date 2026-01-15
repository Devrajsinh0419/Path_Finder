from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import SemesterResult
from .serializers import SemesterResultSerializer
from .models import StudentProfile
from .serializers import StudentProfileSerializer


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

class StudentProfileView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = StudentProfile.objects.filter(user=request.user).first()
        if not profile:
            return Response({}, status=status.HTTP_200_OK)

        serializer = StudentProfileSerializer(profile)
        return Response(serializer.data)

    def post(self, request):
        profile = StudentProfile.objects.filter(user=request.user).first()

        serializer = StudentProfileSerializer(
            profile,    
            data=request.data,
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)

        return Response(serializer.data, status=status.HTTP_200_OK)


class UploadResultPDFView(generics.CreateAPIView):
    serializer_class = SemesterResultSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        # Handle PDF upload and parsing logic here
        return Response({"message": "PDF uploaded successfully"}, status=status.HTTP_201_CREATED)

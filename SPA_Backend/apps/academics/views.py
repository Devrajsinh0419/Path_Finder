from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import SemesterResult, StudentProfile
from .serializers import SemesterResultSerializer, StudentProfileSerializer


class StudentProfileView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = StudentProfileSerializer

    def get(self, request):
        try:
            profile = StudentProfile.objects.get(user=request.user)
            serializer = StudentProfileSerializer(profile)
            return Response(serializer.data)
        except StudentProfile.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def post(self, request):
        # Use the user from the request for the profile
        serializer = self.serializer_class(data=request.data, context={'request': request})
        if serializer.is_valid():
            # update_or_create to handle both creation and update
            profile, created = StudentProfile.objects.update_or_create(
                user=request.user,
                defaults=serializer.validated_data
            )
            # Re-serialize the instance to ensure the response is up-to-date
            response_serializer = self.serializer_class(profile)
            status_code = status.HTTP_201_CREATED if created else status.HTTP_200_OK
            return Response(response_serializer.data, status=status_code)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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

from django.shortcuts import render
from rest_framework import generics
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


from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .services import analyze_performance


class PerformanceAnalysisView(APIView):
    permission_classes = [IsAuthenticated]


    def get(self, request):
        data = analyze_performance(request.user)
        return Response(data)

    
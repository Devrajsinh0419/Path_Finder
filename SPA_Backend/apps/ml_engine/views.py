from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .service import recommend_career
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.accounts.permissions import IsProfileCompleted
from apps.academics.models import SemesterResult
from .feature_builder import build_feature_vector
from .predictor import predict_domain


class CareerRecommendationView(APIView):
    permission_classes = [IsAuthenticated, IsProfileCompleted]

    def get(self, request):
        marks = StudentMark.objects.filter(student=request.user)

        if not marks.exists():
            return Response({"error": "No academic data found"}, status=400)

        feature_vector = build_feature_vector(marks)
        domain, confidence = predict_domain(feature_vector)

        return Response({
            "recommended_domain": domain,
            "confidence": confidence
        })




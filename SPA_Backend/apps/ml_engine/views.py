from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .service import recommend_career


class CareerRecommendationView(APIView):
    permission_classes = [IsAuthenticated]


    def get(self, request):
        data = recommend_career(request.user)
        return Response(data)


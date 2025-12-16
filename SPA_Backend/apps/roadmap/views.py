from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .service import generate_roadmap


class RoadmapView(APIView):
    permission_classes = [IsAuthenticated]


    def get(self, request):
        data = generate_roadmap(request.user)
        return Response(data)


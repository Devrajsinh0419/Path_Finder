from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny
from .serializers import RegisterSerializer, MyTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .permissions import IsProfileCompleted
from .serializers import ProfileCompletionSerializer

class RegisterView(CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]
    authentication_classes = []
    
    def dispatch(self, request, *args, **kwargs):
        # CSRF exempt for API endpoints
        return super().dispatch(request, *args, **kwargs)

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class CompleteProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        profile = request.user.profile

        if profile.is_completed:
            return Response(
                {"message": "Profile already completed"},
                status=status.HTTP_200_OK
            )

        serializer = ProfileCompletionSerializer(
            profile,
            data=request.data
        )

        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Profile completed successfully"},
                status=status.HTTP_200_OK
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


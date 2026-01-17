from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny
from .serializers import RegisterSerializer, MyTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import generics, status
from .permissions import IsProfileCompleted
from .serializers import ProfileCompletionSerializer
from rest_framework_simplejwt.tokens import RefreshToken
import logging

logger = logging.getLogger(__name__)

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]
    authentication_classes = []

    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        print("=" * 50)
        print("REGISTRATION REQUEST")
        print("=" * 50)
        print(f"Request data: {request.data}")
        print(f"Request content type: {request.content_type}")
        print(f"Request method: {request.method}")
        print("=" * 50)
        
        serializer = self.get_serializer(data=request.data)
        
        if not serializer.is_valid():
            print("VALIDATION ERRORS:")
            print(serializer.errors)
            print("=" * 50)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = serializer.save()
            print(f"User created successfully: {user.email}")
            
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            
            response_data = {
                "message": "Registration successful. Please complete your profile.",
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "role": user.role,
                },
                "tokens": {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                }
            }
            
            print(f"Sending response: {response_data}")
            print("=" * 50)
            
            return Response(response_data, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            print(f"ERROR creating user: {str(e)}")
            print("=" * 50)
            import traceback
            traceback.print_exc()
            return Response({
                "error": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class CompleteProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Get user's profile"""
        try:
            profile = request.user.profile
            serializer = ProfileCompletionSerializer(profile)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"error": "Profile not found"},
                status=status.HTTP_404_NOT_FOUND
            )

    def post(self, request):
        """Complete or update user's profile"""
        try:
            profile = request.user.profile
        except:
            return Response(
                {"error": "Profile not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        if profile.is_completed:
            return Response(
                {"message": "Profile already completed"},
                status=status.HTTP_200_OK
            )
        
        serializer = ProfileCompletionSerializer(
            profile,
            data=request.data,
            partial=True
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
    
class StudentProfileView(APIView):
    permission_classes = [IsAuthenticated, IsProfileCompleted]

    def get(self, request):
        profile = request.user.profile
        serializer = ProfileCompletionSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Get user profile details"""
        try:
            user = request.user
            profile = user.profile
            
            return Response({
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "role": user.role,
                },
                "profile": {
                    "full_name": profile.full_name,
                    "enrollment_no": profile.enrollment_no,
                    "college_name": profile.college_name,
                    "current_semester": profile.current_semester,
                    "is_completed": profile.is_completed,
                }
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
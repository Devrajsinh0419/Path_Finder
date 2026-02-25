from rest_framework.permissions import AllowAny
from .serializers import RegisterSerializer, MyTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import generics, status
from firebase_admin import auth as firebase_auth
from .permissions import IsProfileCompleted
from .serializers import ProfileCompletionSerializer
from rest_framework_simplejwt.tokens import RefreshToken
import logging
from django.contrib.auth import get_user_model

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
    
    # REMOVE the is_completed check to allow updates
    # if profile.is_completed:
    #     return Response(
    #         {"message": "Profile already completed"},
    #         status=status.HTTP_200_OK
    #     )
    
        serializer = ProfileCompletionSerializer(
            profile,
            data=request.data,
            partial=True
        )
    
        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    "message": "Profile completed successfully",
                    "profile": serializer.data  # Return the updated profile
                },
                status=status.HTTP_200_OK
            )
    
        print("Serializer errors:", serializer.errors)  # Debug log
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
        
User = get_user_model()

class GoogleAuthView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        token = request.data.get("idToken") or request.data.get("token")

        if not token:
            return Response(
                {"error": "Google ID token is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            decoded_token = firebase_auth.verify_id_token(token)

            email = decoded_token.get("email")
            name = decoded_token.get("name", "").strip()
            name_parts = name.split()
            first_name = name_parts[0] if name_parts else ""
            last_name = " ".join(name_parts[1:]) if len(name_parts) > 1 else ""

            if not email:
                return Response(
                    {"error": "Email not found in Google token"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    "first_name": first_name,
                    "last_name": last_name,
                    "role": "student",
                }
            )

            # Backfill profile names for existing users if missing.
            if not created:
                updated = False
                if first_name and not user.first_name:
                    user.first_name = first_name
                    updated = True
                if last_name and not user.last_name:
                    user.last_name = last_name
                    updated = True
                if updated:
                    user.save(update_fields=["first_name", "last_name"])

            refresh = RefreshToken.for_user(user)

            return Response({
                "tokens": {
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                },
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "role": user.role,
                },
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "is_new_user": created
            })

        except Exception as e:
            logger.exception("Google authentication failed")
            return Response(
                {"error": f"Invalid Google token: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )

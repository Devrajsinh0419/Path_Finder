from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        min_length=8,
        validators=[validate_password]
    )
    email = serializers.EmailField(required=True)
    role = serializers.ChoiceField(
        choices=['student', 'admin'],
        required=False,
        default='student'
    )

    class Meta:
        model = User
        fields = ('email', 'password', 'role')
        extra_kwargs = {
            'email': {'required': True}
        }

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['email'],
            email=validated_data['email'],
            password=validated_data['password'],
            role=validated_data.get('role', 'student')
        )
        return user


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'email'

    def validate(self, attrs):
        # The default validation mechanism of `TokenObtainPairSerializer`
        # uses the `authenticate` method of Django's auth framework.
        # By setting `username_field = 'email'`, the `authenticate` method
        # will use the email for authentication.
        data = super().validate(attrs)

        # Add custom claims to the response
        data.update({'username': self.user.username})
        data.update({'role': self.user.role})

        return data


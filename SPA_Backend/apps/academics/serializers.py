from rest_framework import serializers
from .models import SemesterResult, StudentProfile


class StudentProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentProfile
        fields = '__all__'
        read_only_fields = ('user',)


class SemesterResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = SemesterResult
        fields = '__all__'
        read_only_fields = ('student',)
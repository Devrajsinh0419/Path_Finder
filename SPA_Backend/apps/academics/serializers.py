from rest_framework import serializers
from .models import ProctoringEvent, SemesterResult, StudentProfile


class StudentProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentProfile
        fields = '__all__'
        read_only_fields = ('user',)

    def validate(self, attrs):
        return attrs

    def validate_assessment_domain_scores(self, value):
        if value is None:
            return {}
        if not isinstance(value, dict):
            raise serializers.ValidationError("assessment_domain_scores must be an object.")
        return value


class SemesterResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = SemesterResult
        fields = '__all__'
        read_only_fields = ('student',)


class ProctoringEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProctoringEvent
        fields = "__all__"
        read_only_fields = (
            "id",
            "user",
            "server_timestamp",
            "ip_address",
            "user_agent",
            "suspicious_reasons",
        )

    def validate_metadata(self, value):
        if value is None:
            return {}
        if not isinstance(value, dict):
            raise serializers.ValidationError("metadata must be an object.")
        return value

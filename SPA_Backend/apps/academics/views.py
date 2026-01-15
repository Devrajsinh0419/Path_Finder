from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
import PyPDF2
import re

from .models import SemesterResult, StudentProfile
from .serializers import SemesterResultSerializer, StudentProfileSerializer


class SemesterResultCreateView(generics.CreateAPIView):
    serializer_class = SemesterResultSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)


class SemesterResultListView(generics.ListAPIView):
    serializer_class = SemesterResultSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return SemesterResult.objects.filter(student=self.request.user)


class StudentProfileView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = StudentProfile.objects.filter(user=request.user).first()
        if not profile:
            return Response({}, status=status.HTTP_200_OK)

        serializer = StudentProfileSerializer(profile)
        return Response(serializer.data)

    def post(self, request):
        profile = StudentProfile.objects.filter(user=request.user).first()

        serializer = StudentProfileSerializer(
            profile,
            data=request.data,
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)

        return Response(serializer.data, status=status.HTTP_200_OK)


class UploadResultPDFView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if 'pdf_file' not in request.FILES:
            return Response(
                {"error": "No PDF file provided"},
                status=status.HTTP_400_BAD_REQUEST
            )

        pdf_file = request.FILES['pdf_file']

        if not pdf_file.name.endswith('.pdf'):
            return Response(
                {"error": "Only PDF files are allowed"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            pdf_text = self.extract_text_from_pdf(pdf_file)

            parsed_data = self.parse_grade_sheet(pdf_text)

            if not parsed_data:
                return Response(
                    {"error": "No subjects found in PDF"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            saved_results = self.save_results(request.user, parsed_data)
            domain_recommendation = self.analyze_and_recommend(saved_results)

            return Response({
                "message": "PDF processed successfully",
                "subjects": saved_results,
                "recommendation": domain_recommendation
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def extract_text_from_pdf(self, pdf_file):
        """Extract text from PDF file"""
        reader = PyPDF2.PdfReader(pdf_file)
        text = ""
        for page in reader.pages:
            text += page.extract_text() or ""
        return text

    def parse_grade_sheet(self, text):
        """Parse the grade sheet text to extract subjects and grades"""
        subjects = []

        semester_match = re.search(r'Semester\s*:\s*([IVX]+|\d+)', text, re.IGNORECASE)
        semester = 1

        if semester_match:
            value = semester_match.group(1)
            roman = {'I':1,'II':2,'III':3,'IV':4,'V':5,'VI':6,'VII':7,'VIII':8}
            semester = roman.get(value, int(value) if value.isdigit() else 1)

        pattern = r'(\d{8})\s+([A-Za-z\s\-\(\)\.#]+?)\s+(\d+\.\d+)\s+([A-Z\+]+)\s+(\d+\.\d+)\s+(\d+\.\d+)'
        matches = re.findall(pattern, text)

        for code, name, credit, grade, gp, cp in matches:
            subjects.append({
                'code': code,
                'name': name.strip(),
                'grade': grade.strip(),
                'semester': semester
            })

        return subjects

    def save_results(self, user, subjects):
        saved = []

        for subject in subjects:
            marks = self.grade_to_marks(subject['grade'])

            SemesterResult.objects.update_or_create(
                student=user,
                semester=subject['semester'],
                subject=subject['name'],
                defaults={'marks': marks}
            )

            saved.append({
                'subject': subject['name'],
                'grade': subject['grade'],
                'marks': marks,
                'semester': subject['semester']
            })

        return saved

    def grade_to_marks(self, grade):
        mapping = {
            'O': 95,
            'A+': 85,
            'A': 75,
            'B+': 65,
            'B': 55,
            'P': 45,
            'F': 30
        }
        return mapping.get(grade, 50)

    def analyze_and_recommend(self, subjects):
        domain_keywords = {
            'AI/ML': ['machine learning', 'artificial intelligence'],
            'Web Development': ['web', 'javascript', 'react'],
            'Cybersecurity': ['security', 'cryptography'],
            'IoT': ['iot', 'embedded'],
            'Data Science': ['data', 'analytics'],
        }

        scores = {k: 0 for k in domain_keywords}

        for subject in subjects:
            name = subject['subject'].lower()
            for domain, keywords in domain_keywords.items():
                if any(k in name for k in keywords):
                    scores[domain] += subject['marks']

        best = max(scores, key=scores.get)
        return {'recommendation': best}

from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.core.files.storage import default_storage
import PyPDF2
import re
from .models import SemesterResult
from .serializers import SemesterResultSerializer
from .models import StudentProfile
from .serializers import StudentProfileSerializer



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
        
        # Validate file type
        if not pdf_file.name.endswith('.pdf'):
            return Response(
                {"error": "Only PDF files are allowed"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Extract text from PDF
            pdf_text = self.extract_text_from_pdf(pdf_file)
            
            # Parse the grade sheet
            parsed_data = self.parse_grade_sheet(pdf_text)
            
            # Save results to database
            saved_results = self.save_results(request.user, parsed_data)
            
            # Analyze and recommend domain
            domain_recommendation = self.analyze_and_recommend(saved_results)
            
            return Response({
                "message": "PDF processed successfully",
                "subjects": saved_results,
                "recommendation": domain_recommendation
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            print(f"Error processing PDF: {str(e)}")
            return Response(
                {"error": f"Failed to process PDF: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def extract_text_from_pdf(self, pdf_file):
        """Extract text from PDF file"""
        pdf_reader = PyPDF2.PdfReader(pdf_file)
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text()
        return text

    def parse_grade_sheet(self, text):
        """Parse the grade sheet text to extract subjects and grades"""
        subjects = []
        
        # Extract semester
        semester_match = re.search(r'Semester\s*:\s*(\w+)', text)
        semester = semester_match.group(1) if semester_match else None
        
        # If semester is in Roman numerals, convert to number
        roman_to_int = {'I': 1, 'II': 2, 'III': 3, 'IV': 4, 'V': 5, 'VI': 6}
        if semester in roman_to_int:
            semester = roman_to_int[semester]
        
        # Pattern to match subject lines
        # Example: 03606305 Information Security 3.00 A 8.00 24.00
        pattern = r'(\d+)\s+([A-Za-z\s\-\(\)\.#]+?)\s+(\d+\.\d+)\s+([A-Z\+]+)\s+(\d+\.\d+)\s+(\d+\.\d+)'
        
        matches = re.findall(pattern, text)
        
        for match in matches:
            code, name, credit, grade, grade_point, credit_point = match
            subjects.append({
                'code': code.strip(),
                'name': name.strip(),
                'credit': float(credit),
                'grade': grade.strip(),
                'grade_point': float(grade_point),
                'credit_point': float(credit_point),
                'semester': semester
            })
        
        return subjects

    def save_results(self, user, subjects):
        """Save parsed subjects to database"""
        saved = []
        
        for subject in subjects:
            # Convert grade letter to marks (approximate)
            marks = self.grade_to_marks(subject['grade'])
            
            result, created = SemesterResult.objects.update_or_create(
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
        """Convert grade letter to approximate marks"""
        grade_mapping = {
            'O': 95,
            'A+': 85,
            'A': 75,
            'B+': 65,
            'B': 55,
            'P': 45,
            'F': 30
        }
        return grade_mapping.get(grade, 50)

    def analyze_and_recommend(self, subjects):
        """Analyze subjects and recommend career domain"""
        # Subject keywords for different domains
        domain_keywords = {
            'AI/ML': ['machine learning', 'artificial intelligence', 'data mining', 'neural', 'deep learning'],
            'Web Development': ['web', 'internet', 'html', 'javascript', 'react', '.net', 'programming'],
            'Cybersecurity': ['security', 'cryptography', 'network security', 'ethical hacking'],
            'IoT': ['iot', 'internet of things', 'embedded', 'sensors'],
            'Data Science': ['data', 'statistics', 'analytics', 'visualization', 'mining'],
            'Software Engineering': ['software', 'engineering', 'design patterns', 'testing']
        }
        
        domain_scores = {domain: 0 for domain in domain_keywords.keys()}
        
        for subject in subjects:
            subject_name = subject['subject'].lower()
            marks = subject['marks']
            
            for domain, keywords in domain_keywords.items():
                for keyword in keywords:
                    if keyword in subject_name:
                        domain_scores[domain] += marks
                        break
        
        # Get top 3 domains
        sorted_domains = sorted(domain_scores.items(), key=lambda x: x[1], reverse=True)
        top_domains = [
            {'domain': domain, 'score': score} 
            for domain, score in sorted_domains[:3] 
            if score > 0
        ]
        
        return {
            'top_domains': top_domains,
            'recommendation': top_domains[0]['domain'] if top_domains else 'Software Engineering'
        }
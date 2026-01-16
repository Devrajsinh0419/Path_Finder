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
        # Get all uploaded PDFs (sem1 to sem6)
        uploaded_semesters = []
        total_subjects = 0
        
        for sem_num in range(1, 7):
            field_name = f'semester_{sem_num}'
            if field_name in request.FILES:
                pdf_file = request.FILES[field_name]
                
                # Validate file type
                if not pdf_file.name.endswith('.pdf'):
                    return Response(
                        {"error": f"File for semester {sem_num} must be a PDF"},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                try:
                    # Extract and parse PDF
                    pdf_text = self.extract_text_from_pdf(pdf_file)
                    parsed_data = self.parse_grade_sheet(pdf_text, sem_num)
                    
                    if parsed_data:
                        # Save results
                        saved = self.save_results(request.user, parsed_data, sem_num)
                        uploaded_semesters.append({
                            'semester': sem_num,
                            'subjects_count': len(saved),
                            'subjects': saved
                        })
                        total_subjects += len(saved)
                    
                except Exception as e:
                    print(f"Error processing semester {sem_num}: {str(e)}")
                    return Response(
                        {"error": f"Failed to process semester {sem_num}: {str(e)}"},
                        status=status.HTTP_400_BAD_REQUEST
                    )
        
        if not uploaded_semesters:
            return Response(
                {"error": "No valid PDF files uploaded"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Analyze all uploaded data
        all_results = SemesterResult.objects.filter(student=request.user)
        domain_recommendation = self.analyze_and_recommend(all_results)
        
        return Response({
            "message": f"Successfully processed {len(uploaded_semesters)} semester(s)",
            "uploaded_semesters": uploaded_semesters,
            "total_subjects": total_subjects,
            "recommendation": domain_recommendation
        }, status=status.HTTP_200_OK)

    def extract_text_from_pdf(self, pdf_file):
        """Extract text from PDF file"""
        pdf_reader = PyPDF2.PdfReader(pdf_file)
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text()
        return text

    def parse_grade_sheet(self, text, semester_num):
        """Parse the grade sheet text to extract subjects and grades"""
        subjects = []
        
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
                'semester': semester_num
            })
        
        return subjects

    def save_results(self, user, subjects, semester_num):
        """Save parsed subjects to database"""
        saved = []
        
        # First, delete existing results for this semester
        SemesterResult.objects.filter(student=user, semester=semester_num).delete()
        
        for subject in subjects:
            marks = self.grade_to_marks(subject['grade'])
            
            result = SemesterResult.objects.create(
                student=user,
                semester=semester_num,
                subject=subject['name'],
                marks=marks
            )
            saved.append({
                'subject': subject['name'],
                'grade': subject['grade'],
                'marks': marks
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

    def analyze_and_recommend(self, results):
        """Analyze subjects and recommend career domain"""
        domain_keywords = {
            'AI/ML': ['machine learning', 'artificial intelligence', 'data mining', 'neural', 'deep learning'],
            'Web Development': ['web', 'internet', 'html', 'javascript', 'react', '.net', 'programming'],
            'Cybersecurity': ['security', 'cryptography', 'network security', 'ethical hacking', 'information security'],
            'IoT': ['iot', 'internet of things', 'embedded', 'sensors'],
            'Data Science': ['data', 'statistics', 'analytics', 'visualization', 'mining'],
            'Software Engineering': ['software', 'engineering', 'design patterns', 'testing', 'project']
        }
        
        domain_scores = {domain: 0 for domain in domain_keywords.keys()}
        
        for result in results:
            subject_name = result.subject.lower()
            marks = result.marks
            
            for domain, keywords in domain_keywords.items():
                for keyword in keywords:
                    if keyword in subject_name:
                        domain_scores[domain] += marks
                        break
        
        sorted_domains = sorted(domain_scores.items(), key=lambda x: x[1], reverse=True)
        top_domains = [
            {'domain': domain, 'score': round(score, 2)} 
            for domain, score in sorted_domains[:3] 
            if score > 0
        ]
        
        return {
            'top_domains': top_domains,
            'recommendation': top_domains[0]['domain'] if top_domains else 'Software Engineering'
        }

class StudentAnalysisView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Get student's results and analysis"""
        try:
            results = SemesterResult.objects.filter(student=request.user).order_by('semester', 'subject')
            
            if not results.exists():
                return Response({
                    "has_results": False,
                    "message": "No results uploaded yet"
                }, status=status.HTTP_200_OK)
            
            # Get unique semesters
            semesters_uploaded = list(results.values_list('semester', flat=True).distinct().order_by('semester'))
            
            # Calculate overall CGPA
            total_marks = sum(result.marks for result in results)
            cgpa = (total_marks / (results.count() * 100)) * 10
            
            # Semester-wise breakdown
            semester_data = {}
            for result in results:
                sem = result.semester
                if sem not in semester_data:
                    semester_data[sem] = {
                        'subjects': [],
                        'total_marks': 0,
                        'count': 0
                    }
                semester_data[sem]['subjects'].append({
                    'subject': result.subject,
                    'marks': result.marks,
                    'grade': self.marks_to_grade(result.marks)
                })
                semester_data[sem]['total_marks'] += result.marks
                semester_data[sem]['count'] += 1
            
            # Calculate SGPA for each semester
            semester_scores = []
            for sem in range(1, 7):
                if sem in semester_data:
                    sem_avg = semester_data[sem]['total_marks'] / semester_data[sem]['count']
                    sgpa = (sem_avg / 100) * 10
                    semester_scores.append({
                        'semester': sem,
                        'score': round(sem_avg, 2),
                        'sgpa': round(sgpa, 2),
                        'subjects': semester_data[sem]['subjects'],
                        'has_data': True
                    })
                else:
                    semester_scores.append({
                        'semester': sem,
                        'score': 0,
                        'sgpa': 0,
                        'subjects': [],
                        'has_data': False
                    })
            
            # Domain recommendation
            domain_recommendation = self.analyze_domain(results)
            
            return Response({
                "has_results": True,
                "cgpa": round(cgpa, 2),
                "semesters_uploaded": semesters_uploaded,
                "total_semesters": len(semesters_uploaded),
                "semester_scores": semester_scores,
                "domain_recommendation": domain_recommendation,
                "total_subjects": results.count()
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            print(f"Error fetching analysis: {str(e)}")
            import traceback
            traceback.print_exc()
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def analyze_domain(self, results):
        """Analyze and recommend career domain"""
        domain_keywords = {
            'AI/ML': ['machine learning', 'artificial intelligence', 'data mining', 'neural', 'deep learning'],
            'Web Development': ['web', 'internet', 'html', 'javascript', 'react', '.net', 'programming'],
            'Cybersecurity': ['security', 'cryptography', 'network security', 'ethical hacking', 'information security'],
            'IoT': ['iot', 'internet of things', 'embedded', 'sensors'],
            'Data Science': ['data', 'statistics', 'analytics', 'visualization', 'mining'],
            'Software Engineering': ['software', 'engineering', 'design patterns', 'testing', 'project']
        }
        
        domain_scores = {domain: 0 for domain in domain_keywords.keys()}
        
        for result in results:
            subject_name = result.subject.lower()
            marks = result.marks
            
            for domain, keywords in domain_keywords.items():
                for keyword in keywords:
                    if keyword in subject_name:
                        domain_scores[domain] += marks
                        break
        
        sorted_domains = sorted(domain_scores.items(), key=lambda x: x[1], reverse=True)
        top_domains = [
            {'domain': domain, 'score': round(score, 2)} 
            for domain, score in sorted_domains[:3] 
            if score > 0
        ]
        
        recommendation = top_domains[0]['domain'] if top_domains else 'Software Engineering'
        
        weak_subjects = sorted(results, key=lambda x: x.marks)[:3]
        weak_areas = [result.subject for result in weak_subjects]
        
        strong_subjects = sorted(results, key=lambda x: x.marks, reverse=True)[:3]
        
        return {
            'recommended_domain': recommendation,
            'top_domains': top_domains,
            'weak_areas': weak_areas,
            'strong_subjects': [s.subject for s in strong_subjects]
        }
    
    def marks_to_grade(self, marks):
        """Convert marks to grade"""
        if marks >= 90:
            return 'O'
        elif marks >= 80:
            return 'A+'
        elif marks >= 70:
            return 'A'
        elif marks >= 60:
            return 'B+'
        elif marks >= 50:
            return 'B'
        elif marks >= 40:
            return 'P'
        else:
            return 'F'
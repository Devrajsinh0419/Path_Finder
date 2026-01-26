from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.parsers import MultiPartParser, FormParser

import PyPDF2
import re

from .models import SemesterResult, StudentProfile
from .serializers import SemesterResultSerializer, StudentProfileSerializer
from apps.ml_engine.predictor import predict_domain
from apps.academics.pdf_extractor import extract_grades_from_pdf


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
    parser_classes = [MultiPartParser , FormParser]

    def post(self, request):
        uploaded_semesters = []
        total_subjects = 0

        for sem in range(1, 7):
            field = f"semester_{sem}"
            if field not in request.FILES:
                continue

            pdf_file = request.FILES[field]

            if not pdf_file.name.lower().endswith(".pdf"):
                return Response(
                    {"error": f"Semester {sem} file must be a PDF"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            try:
                extracted = extract_grades_from_pdf(pdf_file)

                SemesterResult.objects.filter(
                    student=request.user,
                    semester=sem
                ).delete()

                saved_subjects = []

                for item in extracted:
                    marks = self.grade_to_marks(item["grade"])
                    encrypted_marks = encrypt_value(marks)

                    SemesterResult.objects.create(
                        student=request.user,
                        semester=sem,
                        subject=item["subject"],
                        marks=encrypted_marks
                    )

                    saved_subjects.append({
                        "subject": item["subject"],
                        "grade": item["grade"]
                    })

                uploaded_semesters.append({
                    "semester": sem,
                    "subjects_count": len(saved_subjects),
                    "subjects": saved_subjects
                })

                total_subjects += len(saved_subjects)

            except Exception as e:
                return Response(
                    {"error": f"Semester {sem} failed: {str(e)}"},
                    status=status.HTTP_400_BAD_REQUEST
                )

        if not uploaded_semesters:
            return Response(
                {"error": "No valid PDFs uploaded"},
                status=status.HTTP_400_BAD_REQUEST
            )

        marks_map = {}

        for r in SemesterResult.objects.filter(student=request.user):
            marks_map[r.subject.upper()] = decrypt_value(r.marks)

        prediction = predict_domain(marks_map)

        return Response(
            {
                "message": "Results processed successfully",
                "uploaded_semesters": uploaded_semesters,
                "total_subjects": total_subjects,
                "domain_recommendation": prediction
            },
            status=status.HTTP_200_OK
        )

    def grade_to_marks(self, grade):
        grade_map = {
            "O": 95,
            "A+": 85,
            "A": 75,
            "B+": 65,
            "B": 55,
            "P": 45,
            "F": 30
        }
        return grade_map.get(grade, 50)
    
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
    
    def analyze_domain(self, results):
        """Analyze and recommend career domain based on ML prediction"""
        
        # Initialize subject category scores
        marks_map = {
            'frontend': 0,
            'backend': 0,
            'ai_ml': 0,
            'cybersecurity': 0,
            'data_science': 0,
            'mobile': 0,
            'devops': 0,
            'iot': 0,
            'blockchain': 0,
            'game_dev': 0
        }
        
        # Subject keywords mapping to categories
        subject_keywords = {
            'frontend': ['web', 'html', 'css', 'javascript', 'react', 'angular', 'vue', 'ui', 'ux', 'frontend'],
            'backend': ['backend', 'server', 'api', 'database', 'sql', 'node', 'django', 'flask', 'spring', '.net', 'java', 'programming'],
            'ai_ml': ['machine learning', 'artificial intelligence', 'neural', 'deep learning', 'ai', 'ml', 'nlp', 'computer vision'],
            'cybersecurity': ['security', 'cryptography', 'network security', 'ethical hacking', 'information security', 'cyber'],
            'data_science': ['data', 'statistics', 'analytics', 'visualization', 'mining', 'big data', 'data science'],
            'mobile': ['mobile', 'android', 'ios', 'flutter', 'react native', 'swift', 'kotlin'],
            'devops': ['devops', 'docker', 'kubernetes', 'ci/cd', 'jenkins', 'aws', 'cloud', 'deployment'],
            'iot': ['iot', 'internet of things', 'embedded', 'sensors', 'arduino', 'raspberry'],
            'blockchain': ['blockchain', 'cryptocurrency', 'smart contract', 'ethereum', 'web3'],
            'game_dev': ['game', 'unity', '3d', 'graphics', 'animation', 'game development']
        }
        
        # Count for averaging
        counts = {key: 0 for key in marks_map.keys()}
        
        # Classify subjects and aggregate marks
        for result in results:
            subject_name = result.subject.lower()
            marks = result.marks
            
            matched = False
            for category, keywords in subject_keywords.items():
                if not matched:  # Only count each subject once
                    for keyword in keywords:
                        if keyword in subject_name:
                            marks_map[category] += marks
                            counts[category] += 1
                            matched = True
                            break
        
        # Calculate averages (avoid division by zero)
        for category in marks_map.keys():
            if counts[category] > 0:
                marks_map[category] = marks_map[category] / counts[category]
            else:
                marks_map[category] = 0
        
        print(f"Marks map for prediction: {marks_map}")  # Debug log
        
        # Use ML predictor
        try:
            from apps.ml_engine.predictor import predict_domain
            prediction, confidence = predict_domain(marks_map)
            
            # Map ML prediction to display-friendly names
            domain_name_mapping = {
                'frontend': 'Frontend Development',
                'backend': 'Backend Development',
                'ai_ml': 'AI/ML',
                'cybersecurity': 'Cybersecurity',
                'data_science': 'Data Science',
                'mobile': 'Mobile Development',
                'devops': 'DevOps',
                'iot': 'IoT',
                'blockchain': 'Blockchain',
                'game_dev': 'Game Development'
            }
            
            recommended_domain = domain_name_mapping.get(prediction, 'Software Engineering')
            
            # Create top domains list from marks_map
            sorted_categories = sorted(marks_map.items(), key=lambda x: x[1], reverse=True)
            top_domains = [
                {
                    'domain': domain_name_mapping.get(cat, cat),
                    'score': round(score, 2)
                }
                for cat, score in sorted_categories[:3]
                if score > 0
            ]
            
        except Exception as e:
            print(f"ML prediction error: {str(e)}")
            import traceback
            traceback.print_exc()
            
            # Fallback to keyword-based recommendation
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
            
            recommended_domain = top_domains[0]['domain'] if top_domains else 'Software Engineering'
            confidence = 0
        
        # Find weak and strong subjects
        weak_subjects = sorted(results, key=lambda x: x.marks)[:3]
        weak_areas = [result.subject for result in weak_subjects]
        
        strong_subjects = sorted(results, key=lambda x: x.marks, reverse=True)[:3]
        
        return {
            'recommended_domain': recommended_domain,
            'confidence': confidence,
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
    
class ManualMarksEntryView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """Save manually entered marks"""
        try:
            semester = request.data.get('semester')
            subjects = request.data.get('subjects', [])

            if not semester or not subjects:
                return Response(
                    {"error": "Semester and subjects are required"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Delete existing results for this semester
            SemesterResult.objects.filter(
                student=request.user,
                semester=semester
            ).delete()

            # Save new results
            saved_subjects = []
            for subject_data in subjects:
                result = SemesterResult.objects.create(
                    student=request.user,
                    semester=semester,
                    subject=subject_data['subject'],
                    marks=subject_data['marks']
                )
                saved_subjects.append({
                    'subject': result.subject,
                    'marks': result.marks,
                    'grade': subject_data['grade']
                })

            return Response({
                "message": f"Marks for Semester {semester} saved successfully",
                "semester": semester,
                "subjects_saved": len(saved_subjects),
                "subjects": saved_subjects
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            print(f"Error saving manual marks: {str(e)}")
            import traceback
            traceback.print_exc()
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        

class HealthCheckView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        return Response({
            "status": "ok",
            "service": "PathFinder Backend",
        })

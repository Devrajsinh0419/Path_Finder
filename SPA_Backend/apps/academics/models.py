from django.db import models
from django.conf import settings

# Create your models here.

User = settings.AUTH_USER_MODEL


class StudentProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_profile')
    full_name = models.CharField(max_length=100, blank=False)
    enrollment_number = models.CharField(max_length=50)
    institute_name = models.CharField(max_length=200)
    current_semester = models.PositiveSmallIntegerField()

    def __str__(self):
        return self.user.email


class SemesterResult(models.Model):
    SEMESTER_CHOICES = [(i, f"Semester {i}") for i in range(1, 7)]


    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='results')
    semester = models.PositiveSmallIntegerField(choices=SEMESTER_CHOICES)
    subject = models.CharField(max_length=100)
    marks = models.FloatField()


    class Meta:
        unique_together = ('student', 'semester', 'subject')


    def __str__(self):
        return f"{self.student} | Sem {self.semester} | {self.subject}"
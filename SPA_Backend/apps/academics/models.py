from django.db import models
from django.conf import settings

# Create your models here.

User = settings.AUTH_USER_MODEL


class StudentProfile(models.Model):
    ASSESSMENT_LEVEL_CHOICES = [
        ("FOUNDATION", "Foundation"),
        ("INTERMEDIATE", "Intermediate"),
        ("ADVANCED", "Advanced"),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_profile')
    full_name = models.CharField(max_length=100, blank=True)
    enrollment_number = models.CharField(max_length=50, blank=True, null=True)
    institute_name = models.CharField(max_length=200, blank=True)
    current_semester = models.PositiveSmallIntegerField(blank=True, null=True)
    interests = models.TextField(blank=True)
    assessment_skill = models.CharField(max_length=100, blank=True)
    assessment_highest_level = models.PositiveSmallIntegerField(blank=True, null=True)
    assessment_level_label = models.CharField(
        max_length=20,
        choices=ASSESSMENT_LEVEL_CHOICES,
        blank=True
    )
    assessment_accuracy = models.PositiveSmallIntegerField(blank=True, null=True)
    assessment_total_questions = models.PositiveSmallIntegerField(blank=True, null=True)
    assessment_correct_answers = models.PositiveSmallIntegerField(blank=True, null=True)
    assessment_domain_scores = models.JSONField(default=dict, blank=True)

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
    
class Subject(models.Model):
    code = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=150)
    semester = models.IntegerField()

    category = models.CharField(
        max_length=20,
        choices=[
            ("CORE", "Core"),
            ("APPLIED", "Applied"),
            ("LAB", "Lab"),
            ("PROJECT", "Project"),
            ("SOFT", "Soft Skill"),
        ]
    )

    weightage = models.FloatField()  # academic importance


class ProctoringEvent(models.Model):
    EVENT_TYPE_CHOICES = [
        ("ASSESSMENT_STARTED", "Assessment Started"),
        ("ANSWER_SUBMITTED", "Answer Submitted"),
        ("TAB_SWITCH", "Tab Switch"),
        ("WINDOW_BLUR", "Window Blur"),
        ("COPY_BLOCKED", "Copy Blocked"),
        ("CUT_BLOCKED", "Cut Blocked"),
        ("PASTE_BLOCKED", "Paste Blocked"),
        ("CONTEXT_MENU_BLOCKED", "Context Menu Blocked"),
        ("SHORTCUT_BLOCKED", "Shortcut Blocked"),
        ("ASSESSMENT_COMPLETED", "Assessment Completed"),
        ("ASSESSMENT_TERMINATED", "Assessment Terminated"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="proctoring_events")
    assessment_session_id = models.CharField(max_length=64, db_index=True)
    assessment_skill = models.CharField(max_length=100, blank=True)
    event_type = models.CharField(max_length=40, choices=EVENT_TYPE_CHOICES)
    suspicious = models.BooleanField(default=False)
    suspicious_reasons = models.JSONField(default=list, blank=True)
    client_timestamp = models.DateTimeField(blank=True, null=True)
    server_timestamp = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    user_agent = models.TextField(blank=True)
    device_fingerprint = models.CharField(max_length=128, blank=True)
    metadata = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ["-server_timestamp"]
        indexes = [
            models.Index(fields=["user", "assessment_session_id", "server_timestamp"]),
            models.Index(fields=["suspicious", "server_timestamp"]),
        ]

    def __str__(self):
        return f"{self.user} | {self.event_type} | {self.server_timestamp.isoformat()}"

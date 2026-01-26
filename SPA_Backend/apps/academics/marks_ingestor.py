#marks_ingestor.py
from academics.models import Subject, StudentMark

def ingest_grades(user, extracted_data):
    saved = 0
    skipped = 0

    for item in extracted_data:
        try:
            subject = Subject.objects.get(code=item["code"])
        except Subject.DoesNotExist:
            skipped += 1
            continue

        StudentMark.objects.update_or_create(
            student=user,
            subject=subject,
            defaults={
                "semester": subject.semester,
                "marks": item["grade_point"]  # marks field now stores grade_point
            }
        )
        saved += 1

    if saved == 0:
        raise ValueError("No subjects matched syllabus")

    return {"saved": saved, "skipped": skipped}

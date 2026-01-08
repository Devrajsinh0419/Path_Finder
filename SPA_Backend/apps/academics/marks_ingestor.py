from academics.models import Subject, StudentMark

def ingest_marks(user, extracted_data):
    for item in extracted_data:
        try:
            subject = Subject.objects.get(code=item["code"])
        except Subject.DoesNotExist:
            # Ignore subjects not in registry (non-tech etc.)
            continue

        StudentMark.objects.update_or_create(
            student=user,
            subject=subject,
            defaults={
                "semester": subject.semester,
                "marks": item["marks"]
            }
        )

from apps.academics.models import SemesterResult




def analyze_performance(user):
    results = SemesterResult.objects.filter(student=user)


    if not results.exists():
        return {"message": "No data available"}


    subject_scores = {}


    for r in results:
        subject_scores.setdefault(r.subject, []).append(r.marks)


    analysis = {}
    for subject, marks in subject_scores.items():
        avg = sum(marks) / len(marks)
        analysis[subject] = {
            'average': round(avg, 2),
            'status': 'Strong' if avg >= 70 else 'Needs Improvement'
}


    return analysis
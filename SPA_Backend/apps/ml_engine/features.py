from apps.academics.models import SemesterResult


def build_feature_vector(user):
    """
    Converts semester-wise marks into subject-wise averages
    Example output:
    {
    'math': 78.5,
    'programming': 82.0,
    'electronics': 65.0
    }
    """
    results = SemesterResult.objects.filter(student=user)
    features = {}


    for r in results:
        key = r.subject.lower()
        features.setdefault(key, []).append(r.marks)


    return {k: sum(v) / len(v) for k, v in features.items()}
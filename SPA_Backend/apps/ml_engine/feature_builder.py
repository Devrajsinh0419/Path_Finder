from .domain_weights import SUBJECT_DOMAIN_WEIGHTS, DOMAINS

def map_subject_to_type(subject):
    if subject.category == "PROJECT":
        return "PROJECT"
    if subject.category == "LAB":
        return "LAB"
    if subject.category == "SOFT":
        return "SOFT"

    name = subject.name.lower()

    if "data structure" in name or "algorithm" in name:
        return "DSA"
    if "operating system" in name:
        return "OS"
    if "database" in name:
        return "DBMS"
    if "web" in name or "php" in name:
        return "WEB"
    if "security" in name:
        return "SECURITY"

    return "PROGRAMMING"


def build_feature_vector(student_marks):
    """
    student_marks: queryset of StudentMark
    """
    domain_scores = {d: 0.0 for d in DOMAINS}

    for record in student_marks:
        subject = record.subject
        grade_point = record.marks  # grade point stored here

        subject_type = map_subject_to_type(subject)
        weights = SUBJECT_DOMAIN_WEIGHTS.get(subject_type)

        if not weights:
            continue

        for domain, w in weights.items():
            domain_scores[domain] += (
                grade_point * subject.weightage * w
            )

    return [domain_scores[d] for d in DOMAINS]

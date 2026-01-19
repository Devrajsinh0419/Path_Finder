from .domain_weights import DOMAINS, SUBJECT_DOMAIN_WEIGHTS

def calculate_domain_scores(marks_map):
    scores = {domain: 0.0 for domain in DOMAINS}

    for subject, marks in marks_map.items():
        subject = subject.upper()

        for key, weights in SUBJECT_DOMAIN_WEIGHTS.items():
            if key in subject:
                for domain, weight in weights.items():
                    scores[domain] += marks * weight

    return {
        "backend": round(scores["BACKEND"], 2) if scores["BACKEND"] else 0,
        "web": round(scores["WEB"], 2) if scores["WEB"] else 0,
        "data": round(scores["DATA"], 2) if scores["DATA"] else 0,
        "soft": round(scores["SOFT"], 2) if scores["SOFT"] else 0,
}
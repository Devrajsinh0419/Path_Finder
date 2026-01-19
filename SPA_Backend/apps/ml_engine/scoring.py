from .domain_weights import DOMAINS, SUBJECT_DOMAIN_WEIGHTS

def calculate_domain_scores(marks_map):
    scores = {domain: 0.0 for domain in DOMAINS}

    for subject, marks in marks_map.items():
        subject = subject.upper()

        for key, weights in SUBJECT_DOMAIN_WEIGHTS.items():
            if key in subject:
                for domain, weight in weights.items():
                    scores[domain] += marks * weight

    return scores

CAREER_RULES = {
'AI / Data Science': ['math', 'statistics', 'python', 'ml'],
'Web Development': ['web', 'html', 'css', 'javascript'],
'Backend Engineering': ['python', 'java', 'dbms'],
'Cyber Security': ['networks', 'security', 'os'],
'Electronics / IoT': ['electronics', 'microcontroller'],
}




def rule_based_recommendation(features):
    scores = {}


    for career, subjects in CAREER_RULES.items():
        score = 0
        for subj in subjects:
            if subj in features:
                score += features[subj]
            scores[career] = score


    return sorted(scores, key=scores.get, reverse=True)
# apps/ml_engine/domain_weights.py

DOMAINS = ["BACKEND", "WEB", "DATA", "AI_ML", "CYBER"]

SUBJECT_DOMAIN_WEIGHTS = {
    "PROGRAMMING": {
        "BACKEND": 1.0,
        "WEB": 0.7,
        "DATA": 0.4,
        "AI_ML": 0.3,
        "CYBER": 0.4,
    },
    "DSA": {
        "BACKEND": 1.0,
        "DATA": 0.9,
        "AI_ML": 0.8,
        "WEB": 0.4,
        "CYBER": 0.6,
    },
    "OS": {
        "BACKEND": 1.0,
        "CYBER": 0.9,
        "DATA": 0.3,
        "AI_ML": 0.2,
        "WEB": 0.1,
    },
    "DBMS": {
        "DATA": 1.0,
        "BACKEND": 0.9,
        "AI_ML": 0.6,
        "WEB": 0.5,
        "CYBER": 0.3,
    },
    "WEB": {
        "WEB": 1.0,
        "BACKEND": 0.6,
        "DATA": 0.2,
        "AI_ML": 0.1,
        "CYBER": 0.3,
    },
    "SECURITY": {
        "CYBER": 1.0,
        "BACKEND": 0.5,
        "DATA": 0.2,
        "AI_ML": 0.1,
        "WEB": 0.2,
    },
    "PROJECT": {
        "BACKEND": 0.7,
        "WEB": 0.7,
        "DATA": 0.6,
        "AI_ML": 0.6,
        "CYBER": 0.6,
    },
    "LAB": {
        "BACKEND": 0.5,
        "WEB": 0.5,
        "DATA": 0.4,
        "AI_ML": 0.4,
        "CYBER": 0.5,
    },
    "SOFT": {
        "BACKEND": 0.1,
        "WEB": 0.1,
        "DATA": 0.1,
        "AI_ML": 0.1,
        "CYBER": 0.1,
    },
}

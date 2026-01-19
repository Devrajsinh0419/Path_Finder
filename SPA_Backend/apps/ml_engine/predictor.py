import joblib
from pathlib import Path
from .domain_weights import DOMAINS
from .scoring import calculate_domain_scores

# Get the absolute path to the model file
BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "model.pkl"

# Try to load the model, handle if it doesn't exist
try:
    model = joblib.load(MODEL_PATH)
except FileNotFoundError:
    print(f"Warning: Model file not found at {MODEL_PATH}")
    print("Please train the model by running: python apps/ml_engine/train_model.py")
    model = None

def predict_domain(marks):
    scores = calculate_domain_scores(marks)

    backend = scores.get("backend", 0)
    web = scores.get("web", 0)
    data = scores.get("data", 0)
    soft = scores.get("soft", 0)

    domain_scores = {
        "BACKEND": backend,
        "WEB": web,
        "DATA": data,
        "SOFT": soft,
    }

    sorted_domains = sorted(
        domain_scores.items(),
        key=lambda x: x[1],
        reverse=True
    )

    primary = sorted_domains[0][0]
    secondary = sorted_domains[1][0]

    confidence = round(
        sorted_domains[0][1] - sorted_domains[1][1], 2
    )

    return {
        "primary_domain": primary,
        "secondary_domain": secondary,
        "confidence": confidence,
        "scores": domain_scores,
    }

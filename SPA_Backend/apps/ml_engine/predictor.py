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

    backend = scores["backend"]
    web = scores["web"]
    data = scores["data"]

    if backend >= web + 0.15:
        primary = "Backend / Software Engineer"
        secondary = "Web Development"
    elif data >= backend:
        primary = "Data / Analytics"
        secondary = "Backend / Software Engineer"
    else:
        primary = "Web Development"
        secondary = "Backend / Software Engineer"

    confidence = max(backend, web, data) / 100

    return {
        "primary_domain": primary,
        "secondary_domain": secondary,
        "scores": scores,
        "confidence": round(confidence, 2),
    }
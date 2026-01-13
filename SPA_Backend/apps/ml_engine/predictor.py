import joblib
from pathlib import Path
from .domain_weights import DOMAINS

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

def predict_domain(feature_vector):
    if model is None:
        # Return a placeholder response when model isn't trained yet
        return "Computer Science", 0.0
    
    prediction = model.predict([feature_vector])[0]
    probs = model.predict_proba([feature_vector])[0]
    confidence = max(probs)
    return prediction, round(confidence * 100, 2)
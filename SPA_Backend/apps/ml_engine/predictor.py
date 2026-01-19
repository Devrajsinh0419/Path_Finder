import joblib
from pathlib import Path

# Get the absolute path to the model file
BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "model.pkl"

# Try to load the model, handle if it doesn't exist
try:
    model = joblib.load(MODEL_PATH)
    print(f"Model loaded successfully from {MODEL_PATH}")
except FileNotFoundError:
    print(f"Warning: Model file not found at {MODEL_PATH}")
    print("Please train the model by running: python apps/ml_engine/train_model.py")
    model = None

def predict_domain(feature_dict):
    """
    Predict career domain based on subject scores
    
    Args:
        feature_dict: Dictionary with keys: frontend, backend, ai_ml, cybersecurity, 
                      data_science, mobile, devops, iot, blockchain, game_dev
    
    Returns:
        tuple: (predicted_domain, confidence)
    """
    if model is None:
        # Return a placeholder response when model isn't trained yet
        print("Model not loaded, using fallback logic")
        
        # Simple fallback: recommend based on highest score
        sorted_scores = sorted(feature_dict.items(), key=lambda x: x[1], reverse=True)
        if sorted_scores and sorted_scores[0][1] > 0:
            return sorted_scores[0][0], 0.0
        return "backend", 0.0
    
    # Ensure all required keys exist with default values
    required_keys = [
        'frontend', 'backend', 'ai_ml', 'cybersecurity', 'data_science',
        'mobile', 'devops', 'iot', 'blockchain', 'game_dev'
    ]
    
    feature_vector = []
    for key in required_keys:
        feature_vector.append(feature_dict.get(key, 0))
    
    print(f"Feature vector for prediction: {feature_vector}")
    
    try:
        prediction = model.predict([feature_vector])[0]
        probs = model.predict_proba([feature_vector])[0]
        confidence = max(probs)
        
        return prediction, round(confidence * 100, 2)
    except Exception as e:
        print(f"Prediction error: {str(e)}")
        # Fallback to highest score
        sorted_scores = sorted(feature_dict.items(), key=lambda x: x[1], reverse=True)
        if sorted_scores and sorted_scores[0][1] > 0:
            return sorted_scores[0][0], 0.0
        return "backend", 0.0
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

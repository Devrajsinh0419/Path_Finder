import joblib
from .domain_weights import DOMAINS

model = joblib.load("apps/ml_engine/model.pkl")

def predict_domain(feature_vector):
    prediction = model.predict([feature_vector])[0]
    probs = model.predict_proba([feature_vector])[0]

    confidence = max(probs)
    return prediction, round(confidence * 100, 2)

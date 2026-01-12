import random
import joblib
from sklearn.ensemble import RandomForestClassifier
from .domain_weights import DOMAINS

def generate_sample():
    scores = [random.uniform(20, 100) for _ in DOMAINS]
    label = DOMAINS[scores.index(max(scores))]
    return scores, label


def train_model():
    X, y = [], []

    for _ in range(500):
        features, label = generate_sample()
        X.append(features)
        y.append(label)

    model = RandomForestClassifier(n_estimators=100)
    model.fit(X, y)

    joblib.dump(model, "apps/ml_engine/model.pkl")
    print("✅ ML Model trained and saved")


if __name__ == "__main__":
    train_model()

from .features import build_feature_vector
from .rules import rule_based_recommendation
from .ml_model import CareerMLModel


ml_model = CareerMLModel()




def recommend_career(user):
    features = build_feature_vector(user)


    if not features:
        return {'message': 'Insufficient data'}


    rule_results = rule_based_recommendation(features)
    ml_results = ml_model.predict(features)


    return {
    'features_used': features,
    'recommended_domains': rule_results[:3],
    'ml_predictions': ml_results
}
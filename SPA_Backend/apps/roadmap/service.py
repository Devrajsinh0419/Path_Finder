from apps.ml_engine.service import recommend_career
from .templates import ROADMAP_TEMPLATES




def generate_roadmap(user):
    recommendation = recommend_career(user)


    if 'recommended_domains' not in recommendation:
        return {'message': 'Career recommendation required'}


    primary_domain = recommendation['recommended_domains'][0]


    roadmap = ROADMAP_TEMPLATES.get(primary_domain)


    if not roadmap:
        return {'message': 'Roadmap not available for this domain'}


    return {
        'career': primary_domain,
        'roadmap': roadmap
        }
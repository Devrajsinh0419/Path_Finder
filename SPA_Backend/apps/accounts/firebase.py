import firebase_admin
from firebase_admin import credentials
import os
import json
from django.conf import settings


def initialize_firebase():
    if not firebase_admin._apps:

        firebase_key = os.environ.get("FIREBASE_SERVICE_ACCOUNT")

        # ✅ Production (Render)
        if firebase_key:
            cred = credentials.Certificate(json.loads(firebase_key))

        # ✅ Local Development
        else:
            cred = credentials.Certificate(
                os.path.join(settings.BASE_DIR, "firebase-service-account.json")
            )

        firebase_admin.initialize_app(cred)
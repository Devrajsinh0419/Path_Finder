import firebase_admin
from firebase_admin import credentials, auth
import os

# Initialize Firebase Admin SDK
cred = credentials.Certificate({
    "type": "service_account",
    "project_id": "your-project-id",
    "private_key_id": "your-private-key-id",
    "private_key": "your-private-key",
    "client_email": "your-client-email",
    "client_id": "your-client-id",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
})

if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)
    
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email
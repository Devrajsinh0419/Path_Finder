from cryptography.fernet import Fernet
from django.conf import settings

fernet = Fernet(settings.MARKS_ENCRYPTION_KEY)

def encrypt_marks(marks: int) -> str:
    return fernet.encrypt(str(marks).encode()).decode()

def decrypt_marks(encrypted_marks: str) -> int:
    return int(fernet.decrypt(encrypted_marks.encode()).decode())

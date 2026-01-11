from rest_framework.permissions import BasePermission

class IsProfileCompleted(BasePermission):
    message = "Profile is incomplete. Please complete your profile."

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        return hasattr(request.user, "profile") and request.user.profile.is_completed

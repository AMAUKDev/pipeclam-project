# your_app/permissions.py
from rest_framework import permissions
from .models import TagPermission

class AdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        idamin_permission = super().has_permission(request, view)

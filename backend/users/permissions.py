from rest_framework import permissions


class IsAdminRole(permissions.BasePermission):
    def has_permission(self, request, view):
        return getattr(request.user, 'is_authenticated', False) and request.user.is_admin


class IsAgentRole(permissions.BasePermission):
    def has_permission(self, request, view):
        return getattr(request.user, 'is_authenticated', False) and request.user.is_agent

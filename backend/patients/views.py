
from rest_framework import viewsets
from rest_framework.permissions import BasePermission

from .models import PatientProfile
from .serializers import PatientProfileSerializer


class PatientProfilePermission(BasePermission):

    def has_permission(self, request, view):

        if not request.user.is_authenticated:
            return False

        if request.user.role == 'ADMIN':
            return request.method in ['GET', 'HEAD', 'OPTIONS']

        return request.user.role == 'PATIENT'


class PatientProfileViewSet(viewsets.ModelViewSet):

    serializer_class = PatientProfileSerializer
    permission_classes = [PatientProfilePermission]

    def get_queryset(self):

        user = self.request.user

        if user.role == 'ADMIN':
            return PatientProfile.objects.select_related('user').all()

        return PatientProfile.objects.filter(user=user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

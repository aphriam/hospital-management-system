from rest_framework import viewsets
from rest_framework.permissions import BasePermission
from rest_framework.exceptions import ValidationError

from .models import Prescription
from .serializers import PrescriptionSerializer


class PrescriptionPermission(BasePermission):

    def has_permission(self, request, view):

        if not request.user.is_authenticated:
            return False

        if view.action in ['list', 'retrieve']:
            return request.user.role in ['ADMIN', 'DOCTOR', 'PATIENT']

        if view.action == 'create':
            return request.user.role == 'DOCTOR'

        return False


class PrescriptionViewSet(viewsets.ModelViewSet):

    serializer_class = PrescriptionSerializer
    permission_classes = [PrescriptionPermission]

    def get_queryset(self):

        user = self.request.user

        if user.role == 'PATIENT':
            return Prescription.objects.filter(
                appointment__patient=user
            )

        elif user.role == 'DOCTOR':
            return Prescription.objects.filter(
                appointment__doctor__user=user
            )

        return Prescription.objects.all()

    def perform_create(self, serializer):

        appointment = serializer.validated_data['appointment']

        if appointment.status != 'COMPLETED':
            raise ValidationError(
                "Prescription can only be created for completed appointments."
            )

        if appointment.doctor.user != self.request.user:
            raise ValidationError(
                "You can only create prescriptions for your own appointments."
            )

        serializer.save()
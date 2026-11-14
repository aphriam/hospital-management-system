from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser,BasePermission

from .models import DoctorProfile,DoctorAvailability
from .serializers import DoctorCreateSerializer,DoctorAvailabilitySerializer

from rest_framework.decorators import action
from rest_framework.response import Response
from .utils import generate_slots
from appointments.models import Appointment


class IsDoctor(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == 'DOCTOR'
        )


class AvailabilityPermission(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return request.user.role in ['ADMIN', 'DOCTOR', 'PATIENT']

        return request.user.role == 'DOCTOR'
    

class DoctorAvailabilityViewSet(viewsets.ModelViewSet):
    serializer_class = DoctorAvailabilitySerializer
    permission_classes = [AvailabilityPermission]
    def get_queryset(self):
        user = self.request.user
        if user.role == 'DOCTOR':
            return DoctorAvailability.objects.filter(
                doctor__user=user
            )
        return DoctorAvailability.objects.filter(
            is_available=True
        )

    def perform_create(self, serializer):
        doctor = DoctorProfile.objects.get(
            user=self.request.user
        )
        serializer.save(doctor=doctor)

    @action(detail=True, methods=['get'])
    def slots(self, request, pk=None):

        availability = self.get_object()

        slots = generate_slots(availability)

        booked_appointments = Appointment.objects.filter(
            doctor=availability.doctor,
            date=availability.date,
            status=Appointment.Status.APPROVED
        )

        available_slots = []

        for slot in slots:

            is_booked = booked_appointments.filter(
                start_time__lt=slot['end_time'],
                end_time__gt=slot['start_time']
            ).exists()

            if not is_booked:
                available_slots.append(slot)

        return Response(available_slots)

class DoctorPermission(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return True

        return request.user.role == 'ADMIN'

class DoctorViewSet(viewsets.ModelViewSet):
    queryset = DoctorProfile.objects.select_related('user').all()
    serializer_class = DoctorCreateSerializer
    permission_classes = [DoctorPermission]



class AvailabilityPermission(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return request.user.role in ['ADMIN', 'DOCTOR', 'PATIENT']

        return request.user.role == 'DOCTOR'
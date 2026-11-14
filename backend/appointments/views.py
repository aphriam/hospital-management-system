from rest_framework import viewsets,status
from rest_framework.permissions import BasePermission

from doctors.models import DoctorProfile, DoctorAvailability
from doctors.utils import generate_slots
from .models import Appointment
from .serializers import AppointmentSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction


class AppointmentPermission(BasePermission):

    def has_permission(self, request, view):

        if not request.user.is_authenticated:
            return False

        if view.action in ['list', 'retrieve']:
            return request.user.role in [
                'ADMIN',
                'DOCTOR',
                'PATIENT'
            ]

        if view.action == 'create':
            return request.user.role == 'PATIENT'
        
        if view.action == 'cancel':
            return request.user.role == 'PATIENT'

        if view.action in ['approve', 'reject']:
            return request.user.role == 'ADMIN'

        if view.action == 'complete':
            return request.user.role == 'DOCTOR'
    
        return False

class AppointmentViewSet(viewsets.ModelViewSet):
    serializer_class = AppointmentSerializer
    permission_classes = [AppointmentPermission]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'PATIENT':
            return Appointment.objects.filter(
                patient=user
            )

        if user.role == 'DOCTOR':
            return Appointment.objects.filter(
                doctor__user=user
            )

        return Appointment.objects.all()
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):

        with transaction.atomic():

            appointment = self.get_object()

                # Lock the doctor record during approval
            DoctorProfile.objects.select_for_update().get(
                id=appointment.doctor_id
            )

            if appointment.status != Appointment.Status.PENDING:
                return Response(
                    {"error": "Only pending appointments can be approved."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            slot_is_available = any(
                any(
                    slot['start_time'] == appointment.start_time
                    and slot['end_time'] == appointment.end_time
                    for slot in generate_slots(availability)
                )
                for availability in DoctorAvailability.objects.filter(
                    doctor=appointment.doctor,
                    date=appointment.date,
                    is_available=True
                )
            )

            if not slot_is_available:
                return Response(
                    {"error": "This doctor's availability no longer includes this slot."},
                    status=status.HTTP_409_CONFLICT
                )

            # Check whether another appointment already occupies this time
            conflict = Appointment.objects.filter(
                doctor=appointment.doctor,
                date=appointment.date,
                status=Appointment.Status.APPROVED,
                start_time__lt=appointment.end_time,
                end_time__gt=appointment.start_time
            ).exclude(
                id=appointment.id
            ).exists()

            if conflict:
                return Response(
                    {"error": "This doctor's time slot is already booked."},
                    status=status.HTTP_409_CONFLICT
                )

            appointment.status = Appointment.Status.APPROVED
            appointment.approved_by = request.user
            appointment.save()

            return Response({
                "message": "Appointment approved successfully.",
                "status": appointment.status
            })
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):

        appointment = self.get_object()

        if appointment.status != Appointment.Status.PENDING:
            return Response(
                {"error": "Only pending appointments can be rejected."},
                status=status.HTTP_400_BAD_REQUEST
            )

        appointment.status = Appointment.Status.REJECTED
        appointment.approved_by = request.user
        appointment.save()

        return Response({
            "message": "Appointment rejected successfully.",
            "status": appointment.status
        })
    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):

        appointment = self.get_object()

        if appointment.status != Appointment.Status.APPROVED:
            return Response(
                {"error": "Only approved appointments can be completed."},
                status=status.HTTP_400_BAD_REQUEST
            )

        appointment.status = Appointment.Status.COMPLETED
        appointment.save()

        return Response({
            "message": "Appointment completed successfully.",
            "status": appointment.status
        })
    
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
    
        appointment = self.get_object()
    
        if appointment.status not in [
            Appointment.Status.PENDING,
            Appointment.Status.APPROVED
        ]:
            return Response(
                {"error": "This appointment cannot be cancelled."},
                status=status.HTTP_400_BAD_REQUEST
            )
    
        appointment.status = Appointment.Status.CANCELLED
        appointment.save()
    
        return Response({
            "message": "Appointment cancelled successfully.",
            "status": appointment.status
        })
    def perform_create(self, serializer):
        serializer.save(
            patient=self.request.user
        )
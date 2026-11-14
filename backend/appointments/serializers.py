from rest_framework import serializers

from .models import Appointment
from doctors.models import DoctorAvailability
from doctors.utils import generate_slots


class AppointmentSerializer(serializers.ModelSerializer):

    patient_username = serializers.CharField(
        source='patient.username',
        read_only=True
    )
    doctor_name = serializers.CharField(
        source='doctor.user.username',
        read_only=True
    )

    class Meta:
        model = Appointment
        fields = [
            'id',
            'doctor',
            'doctor_name',
            'patient',
            'patient_username',
            'date',
            'start_time',
            'end_time',
            'reason',
            'status',
            'approved_by',
            'created_at',
        ]

        read_only_fields = [
            'id',
            'patient',
            'end_time',
            'status',
            'approved_by',
            'created_at',
        ]

    def validate(self, data):

        doctor = data['doctor']
        date = data['date']
        start_time = data['start_time']

        availabilities = DoctorAvailability.objects.filter(
            doctor=doctor,
            date=date,
            is_available=True
        )

        selected_slot = None

        for availability in availabilities:

            slots = generate_slots(availability)

            selected_slot = next(
                (
                    slot for slot in slots
                    if slot['start_time'] == start_time
                ),
                None
            )

            if selected_slot:
                break

        if not selected_slot:
            raise serializers.ValidationError(
                "Selected appointment slot is not available."
            )

        already_booked = Appointment.objects.filter(
            doctor=doctor,
            date=date,
            status=Appointment.Status.APPROVED,
            start_time__lt=selected_slot['end_time'],
            end_time__gt=selected_slot['start_time']
        ).exists()

        if already_booked:
            raise serializers.ValidationError(
                "This appointment slot has already been booked."
            )
        
        self.selected_end_time = selected_slot['end_time']
        return data

    def create(self, validated_data):

        validated_data['end_time'] = self.selected_end_time

        return super().create(validated_data)
from rest_framework import serializers
from .models import Prescription


class PrescriptionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Prescription

        fields = [
            'id',
            'appointment',
            'diagnosis',
            'medicines',
            'instructions',
            'created_at',
        ]

        read_only_fields = [
            'id',
            'created_at',
        ]

def validate_appointment(self, appointment):

    if appointment.status != 'COMPLETED':
        raise serializers.ValidationError(
            "Prescription can only be created for completed appointments."
        )

    if Prescription.objects.filter(
        appointment=appointment
    ).exists():
        raise serializers.ValidationError(
            "A prescription already exists for this appointment."
        )

    return appointment    
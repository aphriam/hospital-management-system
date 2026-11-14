from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password

from accounts.models import User
from .models import DoctorAvailability, DoctorProfile
from accounts.serializers import UserProfileSerializer


class DoctorCreateSerializer(serializers.ModelSerializer):

    username = serializers.CharField(write_only=True)
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(
        write_only=True,
        validators=[validate_password]
    )

    user = UserProfileSerializer(read_only=True)

    class Meta:
        model = DoctorProfile
        fields = [
            'id',
            'user',
            'username',
            'email',
            'password',
            'specialization',
            'qualification',
            'experience',
            'phone',
        ]

    def create(self, validated_data):

        username = validated_data.pop('username')
        email = validated_data.pop('email')
        password = validated_data.pop('password')

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            role=User.Role.DOCTOR
        )

        doctor = DoctorProfile.objects.create(
            user=user,
            **validated_data
        )

        return doctor


class DoctorAvailabilitySerializer(serializers.ModelSerializer):

    doctor = serializers.IntegerField(source='doctor_id', read_only=True)

    class Meta:
        model = DoctorAvailability
        fields = [
            'id',
            'doctor',
            'date',
            'start_time',
            'end_time',
            'slot_duration',
            'is_available',
        ]
        read_only_fields = ['id']

    def validate(self, data):

        data = super().validate(data)
    
        start_time = data.get(
            'start_time',
            self.instance.start_time if self.instance else None
        )
    
        end_time = data.get(
            'end_time',
            self.instance.end_time if self.instance else None
        )
    
        slot_duration = data.get(
            'slot_duration',
            self.instance.slot_duration if self.instance else None
        )
    
        if start_time and end_time and start_time >= end_time:
            raise serializers.ValidationError(
                "End time must be later than start time."
            )
    
        if slot_duration is not None and slot_duration <= 0:
            raise serializers.ValidationError(
                "Slot duration must be greater than zero."
            )
    
        date = data.get(
            'date',
            self.instance.date if self.instance else None
        )
    
        if date and start_time and end_time:
        
            doctor = (
                self.instance.doctor
                if self.instance
                else self.context['request'].user.doctor_profile
            )
    
            overlapping = DoctorAvailability.objects.filter(
                doctor=doctor,
                date=date,
                start_time__lt=end_time,
                end_time__gt=start_time
            )
    
            if self.instance:
                overlapping = overlapping.exclude(
                    id=self.instance.id
                )
    
            if overlapping.exists():
                raise serializers.ValidationError(
                    "This availability overlaps with an existing schedule."
                )
    
        return data
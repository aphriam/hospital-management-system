
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from doctors.views import DoctorViewSet, DoctorAvailabilityViewSet
from accounts.views import PatientRegistrationViewSet
from patients.views import PatientProfileViewSet
from appointments.views import AppointmentViewSet
from prescriptions.views import PrescriptionViewSet
from accounts.views import CurrentUserView


router = DefaultRouter()

router.register(
    'register',
    PatientRegistrationViewSet,
    basename='register'
)
router.register(
    'doctors',
    DoctorViewSet,
    basename='doctors'
)
router.register(
    'doctor-availability',
    DoctorAvailabilityViewSet,
    basename='doctor-availability'
)
router.register(
    'patient-profile',
    PatientProfileViewSet,
    basename='patient-profile'
)
router.register(
    'appointments',
    AppointmentViewSet,
    basename='appointments'
)
router.register(
    'prescriptions',
    PrescriptionViewSet,
    basename='prescriptions'
)

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/', include(router.urls)),

    path(
        'api/token/',
        TokenObtainPairView.as_view(),
        name='token_obtain_pair'
    ),

    path(
        'api/token/refresh/',
        TokenRefreshView.as_view(),
        name='token_refresh'
    ),
    path(
    'api/me/',
    CurrentUserView.as_view(),
    name='current-user'
),
]

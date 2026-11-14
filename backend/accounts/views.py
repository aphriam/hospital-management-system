from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import mixins, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import User
from .serializers import PatientRegistrationSerializer,UserProfileSerializer


class PatientRegistrationViewSet(
    mixins.CreateModelMixin,
    viewsets.GenericViewSet
):

    queryset = User.objects.all()
    serializer_class = PatientRegistrationSerializer
    permission_classes = [AllowAny]


class CurrentUserView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)
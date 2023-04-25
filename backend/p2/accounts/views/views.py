from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView, UpdateAPIView, ListAPIView, RetrieveAPIView

from accounts.models import CustomUser
from accounts.serializers import CustomUserCreateSerializer, CustomUserEditSerializer, CustomUserViewSerializer


# Create your views here.

class RegisterView(CreateAPIView):
    """
    Takes in mandatory username, email, and password fields along with some optional fields and creates
    an account for the user.

    Note that each CustomUser account is tied to a User (django-provided) account. As such, username and email must be
    unique
    """
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserCreateSerializer


class ProfileEditView(UpdateAPIView):
    """
    Allows the currently authenticated user to update/change their profile information.
    Responds with their updated profile information
    """
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserEditSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        custom_user = CustomUser.objects.get(user=self.request.user)
        return custom_user

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)


class CustomUserView(RetrieveAPIView):
    """
    Retrieves the currently authenticated users profile information
    """
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserViewSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        custom_user = CustomUser.objects.get(user=self.request.user)
        return custom_user


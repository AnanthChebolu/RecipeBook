from django.contrib.auth.models import User
from django.db import models
from phonenumber_field.modelfields import PhoneNumberField


AVATAR_PICTURES_DIR = 'avatars/'


class CustomUser(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    email = models.EmailField(unique=True)
    phone_number = PhoneNumberField(null=True, blank=True)
    avatar = models.ImageField(upload_to=AVATAR_PICTURES_DIR, null=True, blank=True)

    def __str__(self):
        return f"{self.user}"

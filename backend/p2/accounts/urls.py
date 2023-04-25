from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView

from accounts.views.views import *

urlpatterns = [
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('register/', RegisterView.as_view()),
    path('profile/edit/', ProfileEditView.as_view()),
    path('profile/view/', CustomUserView.as_view()),
]
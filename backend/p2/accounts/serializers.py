from rest_framework import serializers
from django.contrib.auth.models import User

from accounts.models import CustomUser


class CustomUserCreateSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')
    first_name = serializers.CharField(source='user.first_name', required=False)
    last_name = serializers.CharField(source='user.last_name', required=False)
    password = serializers.CharField(source='user.password')

    class Meta:
        model = CustomUser
        fields = ['username', 'first_name', 'last_name', 'email', 'phone_number', 'avatar', 'password']

    def create(self, validated_data):
        username = validated_data.get('user', {}).get('username')
        password = validated_data.get('user', {}).get('password')
        email = validated_data.get('email')
        first_name = validated_data.get('user', {}).get('first_name', '')
        last_name = validated_data.get('user', {}).get('last_name', '')

        # Checking if a user with the given username already exists
        if User.objects.filter(username=username).exists():
            raise serializers.ValidationError({"username": ["custom user with this username already exists"]})

        base_user = User.objects.create_user(username, email, password, first_name=first_name, last_name=last_name)

        avatar = validated_data.get('avatar')
        phone_number = validated_data.get('phone_number')
        return CustomUser.objects.create(user=base_user, email=email, avatar=avatar, phone_number=phone_number)


class CustomUserEditSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=False)
    username = serializers.CharField(source='user.username', read_only=True)
    phone_number = serializers.CharField(source='user.phone_number', required=False)
    avatar = serializers.ImageField(required=False)
    first_name = serializers.CharField(source='user.first_name', required=False)
    last_name = serializers.CharField(source='user.last_name', required=False)
    password = serializers.CharField(required=False)

    class Meta:
        model = CustomUser
        fields = ('email', 'phone_number', 'avatar', 'first_name', 'last_name', 'password', 'username')

    def update(self, instance, validated_data):
        user = instance.user
        custom_user = CustomUser.objects.get(user=user)

        email = validated_data.get('email', custom_user.email)
        if custom_user.email != email and CustomUser.objects.filter(email=email).exists():
            raise serializers.ValidationError({"email": ["email already taken"]})
        phone_number = validated_data.get('user', {}).get('phone_number', custom_user.phone_number)
        avatar = validated_data.get('avatar', custom_user.avatar)

        user.first_name = validated_data.get('user', {}).get('first_name', user.first_name)
        user.last_name = validated_data.get('user', {}).get('last_name', user.last_name)
        user_password = validated_data.get('password')
        if user_password:
            user.set_password(user_password)
        user.save()
        custom_user.email = email
        custom_user.phone_number = phone_number
        custom_user.avatar = avatar

        custom_user.save()

        return custom_user


class CustomUserViewSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')
    email = serializers.EmailField()
    phone_number = serializers.CharField()
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name')
    avatar = serializers.ImageField()

    class Meta:
        model = CustomUser
        fields = ('username', 'email', 'phone_number', 'first_name', 'last_name', 'avatar')

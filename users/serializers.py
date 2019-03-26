from rest_framework import serializers
from .models import User

class UserRegisterSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('id', 'email', 'firstname', 'lastname',
                  'about_me', 'date_joined', 'avatar' )

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('id', 'email', 'password')
from rest_framework import serializers
from .models import User
from rest_framework.validators import UniqueTogetherValidator

# class UserSerializer(serializers.ModelSerializer):

#     class Meta:
#         model = User
#         fields = ('id', 'email', 'firstname', 'lastname',
#                   'about_me', 'avatar' )
#         read_only_fields = ('id',)

#         validators = [UniqueTogetherValidator(
#                 queryset=User.objects.all(),
#                 fields=('email',)
#             )]

# class UserSerializer(serializers.ModelSerializer):

#     class Meta:
#         model = User
#         fields = ('id', 'email', 'firstname', 'lastname',
#                   'about_me', 'avatar' )

# class UserRegisterSerializer(serializers.Serializer):
#     email = serializers.EmailField(required=True)
#     password = serializers.CharField(required=True)
#     password2 = serializers.CharField(required=True)

#     def validate_email(self, validated_data):
#        email = self.validated_data['email']
#        qs = User.objects.filter(email=email)
#        if qs.exists():
#            raise serializers.ValidationError("email is taken")
#        return email

#     def validate_password2(self, validated_data):
#        # Check that the two password entries match
#        password1 = self.validated_data["password"]
#        password2 = self.validated_data["password2"]

#        if password1 and password2 and password1 != password2:
#            raise serializers.ValidationError("Passwords don't match")
#        return password2

# def validate_email(email):
#     qs = User.objects.filter(email=email)
#     if qs.exists():
#         raise serializers.ValidationError("email is taken")
#     return email

# def validate_password2(password, password2):

#     if password and password2 and password != password2:
#         raise serializers.ValidationError("Passwords don't match")
#     return password2

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('id', 'email', 'firstname', 'lastname',
                  'about_me', 'avatar' )

# class UserRegisterSerializer(serializers.Serializer):
#     email = serializers.EmailField(validators=[validate_email])
#     password = serializers.CharField(required=True)
#     password2 = serializers.CharField(required=True)
#     # password2 = serializers.CharField(validators=[validate_password2])

class UserRegisterSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('email', 'password')

    def create(self, validated_data):
        user = super().create(validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user
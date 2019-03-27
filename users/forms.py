from django import forms
from django.db import models
from django.forms import ModelForm
from django.contrib.auth import authenticate, login, logout
from .models import User

"""
    class UserRegForm(UserCreationForm):
    email = forms.EmailField(required=True)

    def uniqueEmail(self, request):
        email = self.cleaned_data.get('email')
        usrs = User.objects.get()
        if email in usrs.email:
            return True
        else:
            return False
"""

class UserLoginForm(forms.Form):
    email = forms.CharField(label="Email", widget=forms.EmailInput(attrs={'placeholder': 'email@domain.com'}), required=True)
    password = forms.CharField(label= "Password", widget=forms.PasswordInput(attrs={'placeholder': 'Password'}), required=True)

    def auth(self, request):
        uname = self.cleaned_data.get('email')
        pword = self.cleaned_data.get('password')
        return authenticate(request, username=uname, password=pword)

class UpdateUserForm(ModelForm):
    avatar = forms.ImageField()
    email = forms.CharField(label="Email", widget=forms.EmailInput(attrs={'placeholder': 'email@domain.com'}), required=True)
    firstname = forms.CharField(label="First Name", widget=forms.TextInput(attrs={'placeholder':'First Name'}), max_length=200, required=False)
    lastname = forms.CharField(label="Last Name", widget=forms.TextInput(attrs={'placeholder':'Last Name'}), max_length=200, required=False)
    about_me = forms.CharField(label="About Me", widget=forms.Textarea(attrs={'placeholder':'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris'}), required=False)

    class Meta:
        model = User
        fields = ['avatar', 'email', 'firstname', 'lastname', 'about_me']

class UserRegForm(ModelForm):
    email = forms.CharField(label="Email", widget=forms.EmailInput(attrs={'placeholder': 'email@domain.com'}), required=True)
    password = forms.CharField(label= "Password", widget=forms.PasswordInput(attrs={'placeholder': 'Password'}), required=True)
    password2 = forms.CharField(label= "Confirm Password", widget=forms.PasswordInput(attrs={'placeholder': 'Confirm Password'}), required=True)

    class Meta:
        model = User
        fields = ['email', 'password']

    def clean_email(self):
       email = self.cleaned_data.get('email')
       qs = User.objects.filter(email=email)
       if qs.exists():
           raise forms.ValidationError("email is taken")
       return email

    def clean_password2(self):
       # Check that the two password entries match
       password1 = self.cleaned_data.get("password")
       password2 = self.cleaned_data.get("password2")

       if password1 and password2 and password1 != password2:
           raise forms.ValidationError("Passwords don't match")

       return password2

    def save(self, commit=True):
        instance = super(UserRegForm, self).save(commit=False)
        instance.set_password(self.cleaned_data.get('password'))

        if commit:
            instance.save()

        return instance

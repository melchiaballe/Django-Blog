from django.shortcuts import (
    render, 
    HttpResponse, 
    redirect, 
    get_object_or_404, 
    HttpResponseRedirect)
from django.contrib.auth import (
    authenticate, 
    login, 
    logout)
from .models import User 
from .forms import (
    UserLoginForm, 
    UserRegForm, 
    UpdateUserForm)
from django.contrib.auth.forms import (
    PasswordChangeForm, 
    PasswordResetForm)
from django.views.generic.base import TemplateView


from rest_framework import generics

# Create your views here.

class LogoutView(TemplateView):
    
    def get(self, request):
        logout(request)
        return redirect('users:login')

class LoginView(TemplateView):

    def get(self, request):
        form = UserLoginForm()
        return render(request, 'users/login.html', {'form':form})

    def post(self, request):
        form = UserLoginForm(request.POST)
        if form.is_valid():
            user = form.auth(request)
            if user is not None:
                login(request, user)
                return redirect('blog:homepage')
            else:
                form = UserLoginForm(request.POST)
                form.add_error(None, "Invalid User Entry")
                return render(request, 'users/login.html', {'form':form})

class RegisterUserView(TemplateView):

    def get(self, request):
        form = UserRegForm()
        return render(request, 'users/register.html', {'form': form})

    def post(self, request):
        form = UserRegForm(request.POST)
        if form.is_valid():
            user = form.save()
            user = authenticate(email=user.email, password=form.cleaned_data.get('password'))
            if user is not None:
                login(request, user)
                return redirect('users:edituser')
        else:
            form = UserRegForm(request.POST)
        return render(request, 'users/register.html', {'form': form})

class EditUserView(TemplateView):

    def get(self, request):
        if request.user.is_authenticated:
            data = {'userid': request.user.id,
            'avatar': request.user.avatar,
            'email': request.user.email,
            'firstname': request.user.firstname,
            'lastname': request.user.lastname,
            'about_me': request.user.about_me}
            
            form = UpdateUserForm(initial=data)
            return render(request, 'users/edituser.html', {'form': form})
        else:
            return redirect('users:login')

    def post(self, request):
        if request.user.is_authenticated:
            form = UpdateUserForm(request.POST, request.FILES, instance=request.user)
            if form.is_valid():
                form.save()
                return redirect('blog:homepage')
            else:
                form = UpdateUserForm(request.POST)
        else:
            return redirect('users:login')


class EditPassword(TemplateView):

    def get(self, request):
        if request.user.is_authenticated:
            form = PasswordChangeForm(request.user)
            return render(request, 'users/editpassword.html', {'form': form})
        else:
            return redirect('users:login')

    def post(self, request):
        if request.user.is_authenticated:
            form = PasswordChangeForm(request.user, request.POST)
            if form.is_valid():
                form.save()
            return redirect('users:logout')
        else:
            return redirect('users:login')


def reset_password(request):
    if request.method == 'POST':
        form = PasswordResetForm(request.POST)
        if form.is_valid():
            pass
            #form.save() 
            return redirect('users:login')
        else:
            form = PasswordResetForm(request.POST)
    else:
        form = PasswordResetForm()  
    return render(request, 'users/resetpassword.html', {'form': form})
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
from django.contrib.auth.forms import PasswordChangeForm


# Create your views here.
def logout_user(request):
    logout(request)
    return redirect('users:login')


def process_login(request):
    if request.method == "POST":
        form = UserLoginForm(request.POST)
        if form.is_valid():
            user = form.auth(request)
            if user is not None:
                login(request, user)
                return redirect('users:edituser')
            else:
                form = UserLoginForm(request.POST)
                form.add_error(None, "Invalid User Entry")
    else:
        form = UserLoginForm()
    return render(request, 'users/login.html', {'form':form})


def register_user(request):
    if request.method == 'POST':
        form = UserRegForm(request.POST)
        if form.is_valid():
            user = form.save()
            user = authenticate(email=user.email, password=form.cleaned_data.get('password'))
            if user is not None:
                login(request, user)
            return HttpResponse("HELLO THERE NEW USER")
        else:
            form = UserRegForm(request.POST)
    else:
        form = UserRegForm()
    return render(request, 'users/register.html', {'form': form})

def edit_user(request):
    if request.user.is_authenticated:
        if request.method == 'POST':
            form = UpdateUserForm(request.POST)
            if form.is_valid():
                form.update(request)
                return HttpResponse("HELLO THERE NEW USER")
            else:
                form = UpdateUserForm(request.POST)
        else:
            data = {'userid': request.user.id,
             'email': request.user.email,
             'firstname': request.user.firstname,
             'lastname': request.user.lastname,
             'about_me': request.user.about_me}

            form = UpdateUserForm(initial=data)
        return render(request, 'users/edituser.html', {'form': form})
    else:
        return redirect('users:login')

def edit_password(request):
    if request.user.is_authenticated:
        if request.method == 'POST':
            form = PasswordChangeForm(request.user, request.POST)
            if form.is_valid():
                form.save()
                return redirect('users:logout')
        else:
            form = PasswordChangeForm(request.user)
        return render(request, 'users/editpassword.html', {'form': form})
    else:
        return redirect('users:login')
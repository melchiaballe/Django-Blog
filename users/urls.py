from django.urls import path

from . import views

app_name = 'users'
urlpatterns = [
    path('accounts/login', views.LoginView.as_view(), name = "login"),
    path('accounts/logout', views.LogoutView.as_view(), name = "logout"),
    path('accounts/register', views.RegisterUserView.as_view(), name = "register"),
    path('accounts/forget/password', views.reset_password, name = "resetpass"),
    path('accounts/edit/user', views.EditUserView.as_view(), name = "edituser"),
    path('accounts/edit/password', views.EditPassword.as_view(), name = "editpass"),
]
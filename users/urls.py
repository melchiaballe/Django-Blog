from django.urls import path

from . import views


app_name = 'users'
urlpatterns = [
    path('accounts/login', views.process_login, name = "login"),
    path('accounts/logout', views.LogoutView.as_view(), name = "logout"),
    path('accounts/register', views.register_user, name = "register"),
    path('accounts/forget/password', views.reset_password, name = "resetpass"),
    path('accounts/edit/user', views.edit_user, name = "edituser"),
    path('accounts/edit/password', views.edit_password, name = "editpass"),
]
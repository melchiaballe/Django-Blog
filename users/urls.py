from django.urls import path

from . import views
from blog.api import ArticleViewSet, commentserializer, articledetailsserializer, commentdetailsserializer

app_name = 'users'
urlpatterns = [
    path('accounts/login', views.LoginView.as_view(), name = "login"),
    path('accounts/logout', views.LogoutView.as_view(), name = "logout"),
    path('accounts/register', views.RegisterUserView.as_view(), name = "register"),
    path('accounts/forget/password', views.reset_password, name = "resetpass"),
    path('accounts/edit/user', views.EditUserView.as_view(), name = "edituser"),
    path('accounts/edit/password', views.EditPassword.as_view(), name = "editpass"),


    path('api/Register', views.UserRegisterList.as_view()),
    path('api/Register/<int:pk>/', views.UserDetail.as_view()),

    path('api/article', ArticleViewSet.as_view(), name="articleviewset"),
    path('api/comment', commentserializer.as_view()),
    path('api/Update/article/<int:pk>/', articledetailsserializer.as_view()),
    path('api/Update/comment/<int:pk>/', commentdetailsserializer.as_view()),
]
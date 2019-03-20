from django.urls import path

from . import views


app_name = 'blog'
urlpatterns = [
    path('', views.home_page, name = "homepage"),
    path('article/', views.user_articles, name = "userarticle"),
    path('article/add', views.add_article, name = "addarticle"),
    path('article/delete/<int:article_id>', views.delete_article, name = "deletearticle"),
    path('article/<int:article_id>', views.article_details, name = "articledetails"),
    path('article/edit/<int:article_id>', views.edit_article, name = "editarticle"),
]
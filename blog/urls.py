from django.urls import path

from . import views


app_name = 'blog'
urlpatterns = [
    path('', views.home_page, name = "homepage"),
    path('article/', views.user_articles, name = "userarticle"),
    path('article/add', views.add_article, name = "addarticle"),
    path('article/add/comment/<int:article_id>', views.comment_add, name = "addcomment"),
    path('article/delete/comment/<int:article_id>/<int:comment_id>', views.comment_delete, name = "deletecomment"),
    path('article/delete/<int:article_id>', views.delete_article, name = "deletearticle"),
    path('article/<int:article_id>', views.article_details, name = "articledetails"),
    path('article/edit/<int:article_id>', views.edit_article, name = "editarticle"),
]
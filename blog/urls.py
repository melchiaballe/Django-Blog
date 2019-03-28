from django.urls import path

from . import views
from .views import (
    ArticleTemplateView, 
    HomePageTemplateView, 
    EditArticleTemplateView, 
    UserArticlesTemplateView, 
    ArticleDetailsTemplateView,
    UserArticleLikesTemplateView)
from .api import NewArticleViewSet, UserViewSet, CommentViewSet, LikeViewSet

app_name = 'blog'
urlpatterns = [
    path('', views.home_page, name = "homepage"),
    path('article/<int:user_id>', views.user_articles, name = "userarticle"),
    path('article/liked', views.view_liked, name = "viewliked"),
    path('article/add', views.add_article, name = "addarticle"),
    path('article/add/comment/<int:article_id>', views.comment_add, name = "addcomment"),
    path('article/edit/comment/<int:comment_id>', views.comment_edit, name = "editcomment"),
    path('article/delete/comment/<int:comment_id>', views.comment_delete, name = "deletecomment"),
    path('article/delete/<int:article_id>', views.delete_article, name = "deletearticle"),
    path('article/details/<int:article_id>', views.article_details, name = "articledetails"),
    path('article/edit/<int:article_id>', views.edit_article, name = "editarticle"),
    path('article/like/<int:article_id>', views.article_like, name = "likearticle"),

    path('accounts/follow/<int:user_id>', views.user_follow, name = "followuser"),

    path('drf/homepage', HomePageTemplateView.as_view(), name = "drfhome"),
    path('drf/user/article/<int:user_id>', UserArticlesTemplateView.as_view(), name = "drfuserarticle"),
    path('drf/article/<int:article_id>', EditArticleTemplateView.as_view(), name = "drfeditarticle"),
    path('drf/article/details/<int:article_id>', ArticleDetailsTemplateView.as_view(), name = "drfarticledetails"),
    path('drf/user/article/likes', UserArticleLikesTemplateView.as_view(), name = "drfuserlikearticle"),
]
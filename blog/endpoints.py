from django.urls import path

from . import views
from .views import ArticleTemplateView, HomePageTemplateView
from .api import NewArticleViewSet, UserViewSet, CommentViewSet, LikeViewSet


app_name = 'endpoint'
urlpatterns = [
    #Viewing
    path('article', NewArticleViewSet.as_view({'get': 'list_articles'}), name = "drflistarticle"),
    path('article/<int:article_id>', NewArticleViewSet.as_view({'get': 'article_details'}), name = "drfarticledetails"),
    path('user', UserViewSet.as_view({'get': 'list_user'}), name = "drfuserlist"),
    path('user/<int:user_id>/', UserViewSet.as_view({'get': 'user_details'}), name = "drfuserdetails"),
    path('comment', CommentViewSet.as_view({'get': 'list_comments'}), name = "drfcommentlist"),
    path('comment/<int:comment_id>/', CommentViewSet.as_view({'get': 'comment_details'}), name = "drfcommentdetails"),
    path('like', LikeViewSet.as_view({'get': 'list_like'}), name = "drflistlikes"),
    path('like/<int:like_id>', LikeViewSet.as_view({'get': 'like_details'}), name = "drflikedetails"),

    path('article/<int:article_id>/likes', LikeViewSet.as_view({'get': 'list_likes_article'}), name = "drflikeperarticle"),
    path('article/<int:article_id>/comments', CommentViewSet.as_view({'get': 'list_comments_article'}), name = "drfcommentperarticle"),

    #Execute Create
    path('article', NewArticleViewSet.as_view({'post': 'create_article'}), name = "drfarticle"),
    path('user', UserViewSet.as_view({'post': 'create_user'}), name = "drfuser"),
    path('comment', CommentViewSet.as_view({'post': 'create_comment'}), name = "drfcomment"),

    #Execute Update
    path('article/<int:article_id>', NewArticleViewSet.as_view({'post': 'update_article'}), name = "drfupdatearticle"),
    path('user/<int:user_id>', UserViewSet.as_view({'post': 'update_user'}), name = "drfupdateuser"),
    path('comment/<int:comment_id>', CommentViewSet.as_view({'post': 'update_comment'}), name = "drfupdatecomment"),

    #Execute Delete
    path('article/<int:article_id>/delete', NewArticleViewSet.as_view({'get': 'delete_article'}), name = "drfarticledelete"),
    path('comment/<int:comment_id>/delete', CommentViewSet.as_view({'get': 'delete_comment'}), name = "drfcommentdelete"),
    path('like/<int:like_id>/delete', LikeViewSet.as_view({'get': 'delete_like'}), name = "drflikedelete"),
]
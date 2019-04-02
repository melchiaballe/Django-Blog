from django.urls import path

from . import views
from .views import ArticleTemplateView, HomePageTemplateView
from .api import NewArticleViewSet, UserViewSet, CommentViewSet, LikeViewSet, FollowViewSet


app_name = 'endpoint'
urlpatterns = [
    #Viewing
    #get all article
    path('article', NewArticleViewSet.as_view({'get': 'list_articles','post': 'create_article'}), name = "drflistarticle"),
    #get all featured article
    path('article/featured', NewArticleViewSet.as_view({'get': 'list_featured_articles'}), name = "drflistfeaturedarticle"),
    #get article details
    path('article/details/<int:article_id>', NewArticleViewSet.as_view({'get': 'article_details'}), name = "drfarticledetails"),
    #get all comment
    path('comment', CommentViewSet.as_view({'get': 'list_comments','post': 'create_comment'}), name = "drfcommentlist"),
    #create comment
    path('<int:article_id>/comment', CommentViewSet.as_view({'post': 'create_comment'}), name = "drfcommentpost"),
    #comment details
    path('comment/details/<int:comment_id>/', CommentViewSet.as_view({'get': 'comment_details'}), name = "drfcommentdetails"),
    #get all likes
    path('like', LikeViewSet.as_view({'get': 'list_like'}), name = "drflistlikes"),
    #get like with like id
    path('like/<int:like_id>', LikeViewSet.as_view({'get': 'like_details'}), name = "drflikedetails"),
    #likes per article
    path('article/<int:article_id>/likes', LikeViewSet.as_view({'get': 'list_likes_article', 'post':'create_like'}), name = "drflikeperarticle"),
    #total likes per article
    path('article/<int:article_id>/total/likes', LikeViewSet.as_view({'get': 'total_likes_article'}), name = "drftotallikeperarticle"),
    #user liked article
    path('article/<int:article_id>/user/likes', LikeViewSet.as_view({'get': 'user_likes_article'}), name = "drfuserlikearticle"),
    #total comments per article
    path('article/<int:article_id>/total/comments', CommentViewSet.as_view({'get': 'total_comments_article'}), name = "drftotalcommentsperarticle"),
    #likes per user
    path('article/user/<int:user_id>/likes', LikeViewSet.as_view({'get': 'list_user_liked_article'}), name = "drflikesperuser"),
    #get all follow
    path('follow', FollowViewSet.as_view({'get': 'list_follow'})),

    #get all user following
    path('user/<int:user_id>/following', FollowViewSet.as_view({'get': 'user_follows_list'})),
    #get all user followers
    path('user/<int:user_id>/followers', FollowViewSet.as_view({'get': 'user_followers_list'})),

    #owner followed user
    path('follows/user/<int:user_id>', FollowViewSet.as_view({'get': 'owner_follows_user'})),
    #create follow
    path('user/<int:user_id>/follow', FollowViewSet.as_view({'post':'create_follow'}), name = "drffollowuser"),
    #remove follow
    path('user/<int:user_id>/remove/follow', FollowViewSet.as_view({'post':'delete_follow'})),
    #total following
    path('user/<int:user_id>/total/following', FollowViewSet.as_view({'get': 'total_user_following'})),
    #total follower
    path('user/<int:user_id>/total/follower', FollowViewSet.as_view({'get': 'total_user_follower'})),

    #-----------------------------------------------------------------------------------------------------------------------------------------
    #update user
    path('user/update', UserViewSet.as_view({'post': 'update_user'}), name = "drfupdateuser"),
    #get list of user and create user
    path('user', UserViewSet.as_view({'get': 'list_user','post': 'create_user'}), name = "drfuserlist"),
    #get user details
    path('user/<int:user_id>/', UserViewSet.as_view({'get': 'user_details'}), name = "drfuserdetails"),
    #-----------------------------------------------------------------------------------------------------------------------------------------

    #comments per article
    path('article/<int:article_id>/comments', CommentViewSet.as_view({'get': 'list_comments_article'}), name = "drfcommentperarticle"),
    #article per user
    path('article/user/<int:user_id>', NewArticleViewSet.as_view({'get': 'list_user_article'}), name = "drfarticleperuser"),

    #Execute Create
    # path('user', UserViewSet.as_view({'post': 'create_user'}), name = "drfuser"),

    #Execute Update
    path('article/update/<int:article_id>', NewArticleViewSet.as_view({'post': 'update_article'}), name = "drfupdatearticle"),
    path('comment/update/<int:comment_id>', CommentViewSet.as_view({'post': 'update_comment'}), name = "drfupdatecomment"),

    #Execute Delete
    path('article/<int:article_id>/delete', NewArticleViewSet.as_view({'post': 'delete_article'}), name = "drfarticledelete"),
    path('comment/<int:comment_id>/delete', CommentViewSet.as_view({'post': 'delete_comment'}), name = "drfcommentdelete"),
    path('article/<int:article_id>/like/delete', LikeViewSet.as_view({'post': 'delete_like'}), name = "drflikedelete"),

]
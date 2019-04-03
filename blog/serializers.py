from rest_framework import serializers
from .models import Article, ArticleComments, ArticleLikes, UserFollowing
from users.serializers import UserSerializer


# from rest_framework.pagination import PageNumberPagination

# class StandardResultsSetPagination(PageNumberPagination):
#     page_size = 10
#     max_page_size = 10


class ArticleSerializer(serializers.ModelSerializer):
    #owner = serializers.ReadOnlyField(source='owner.username')
    #pagination_class = StandardResultsSetPagination
    owner = UserSerializer(read_only=True)

    class Meta:
        model = Article
        fields = ['id', 'title', 'article_image', 'description', 'is_featured', 'owner']
        #read_only_fields = ('owner',)

class CommentSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    article = ArticleSerializer(read_only=True)

    class Meta:
        model = ArticleComments
        fields = ['id', 'content', 'article', 'owner']

class LikeSerializer(serializers.ModelSerializer):

    owner = UserSerializer(read_only=True)
    article = ArticleSerializer(read_only=True)
    
    class Meta:
        model = ArticleLikes
        fields = ['id', 'likebool', 'article', 'owner']

class FollowSerializer(serializers.ModelSerializer):
    following = UserSerializer(read_only=True)
    owner = UserSerializer(read_only=True)
    
    class Meta:
        model = UserFollowing
        fields = ['id', 'followbool', 'following', 'owner']
from rest_framework import serializers
from .models import Article, ArticleComments, ArticleLikes
from users.serializers import UserSerializer


# from rest_framework.pagination import PageNumberPagination

# class StandardResultsSetPagination(PageNumberPagination):
#     page_size = 10
#     page_size_query_param = 'page_size'
#     max_page_size = 10


class ArticleSerializer(serializers.ModelSerializer):
    #owner = serializers.ReadOnlyField(source='owner.username')
    owner = UserSerializer()

    class Meta:
        model = Article
        fields = ['id', 'title', 'article_image', 'description', 'owner', 'is_featured']
        read_only_fields = ('owner',)

class CommentSerializer(serializers.ModelSerializer):

    owner = UserSerializer()
    article = ArticleSerializer()

    class Meta:
        model = ArticleComments
        fields = ['id', 'content', 'article', 'owner']

class LikeSerializer(serializers.ModelSerializer):

    owner = UserSerializer()
    article = ArticleSerializer()
    
    class Meta:
        model = ArticleLikes
        fields = ['id', 'likebool', 'article', 'owner']
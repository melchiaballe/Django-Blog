from rest_framework import serializers
from .models import Article, ArticleComments, ArticleLikes
from users.serializers import UserSerializer


class ArticleSerializer(serializers.ModelSerializer):
    #owner = serializers.ReadOnlyField(source='owner.username')
    owner = UserSerializer()

    class Meta:
        model = Article
        fields = ['id', 'title', 'article_image', 'description', 'owner']
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
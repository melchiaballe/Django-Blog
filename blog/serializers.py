from rest_framework import serializers
from .models import Article, ArticleComments


class ArticleSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = Article
        fields = ['id', 'title', 'article_image', 'description', 'owner']

class CommentSerializer(serializers.ModelSerializer):

    class Meta:
        model = ArticleComments
        fields = ['id', 'content', 'article', 'owner']
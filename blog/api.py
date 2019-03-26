from .models import Article, FeaturedArticle, ArticleComments, ArticleLikes, UserFollowing
from django.core.paginator import Paginator
from django.db.models import Count
from users.models import User

from rest_framework import viewsets
from rest_framework import generics
from .serializers import ArticleSerializer, CommentSerializer

class ArticleViewSet(generics.CreateAPIView):
    """
        Create Article View Set
    """
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class commentserializer(generics.ListCreateAPIView):
    queryset = ArticleComments.objects.all()
    serializer_class = CommentSerializer

class articledetailsserializer(generics.RetrieveUpdateDestroyAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer

class commentdetailsserializer(generics.RetrieveUpdateDestroyAPIView):
    queryset = ArticleComments.objects.all()
    serializer_class = CommentSerializer

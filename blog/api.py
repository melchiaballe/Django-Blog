from django.shortcuts import (
    Http404,
    render, 
    HttpResponse, 
    redirect, 
    get_object_or_404, 
    HttpResponseRedirect)
from .models import Article, FeaturedArticle, ArticleComments, ArticleLikes, UserFollowing, ArticleComments
from django.core.paginator import Paginator
from django.db.models import Count
from users.models import User

from rest_framework import generics
from .serializers import ArticleSerializer, CommentSerializer, LikeSerializer
from rest_framework import viewsets
from rest_framework.response import Response

from users.serializers import UserSerializer

class NewArticleViewSet(viewsets.ViewSet):

    def create_article(self, request, **kwargs):
        import pdb; pdb.set_trace()
        article = Article.objects.all()
        user = request.user
        data = request.data
        serializer = ArticleSerializer(data=data)
        if serializer.is_valid():
            data = serializer.save(owner=user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    
    def list_articles(self, request, **kwargs):
        articles =  Article.objects.all()
        serializer = ArticleSerializer(articles, many=True)
        return Response(serializer.data, status=200)
    
    def list_featured_articles(self, request, **kwargs):
        articles =  Article.objects.filter(is_featured=True).order_by('?')[:3]
        serializer = ArticleSerializer(articles, many=True)
        return Response(serializer.data, status=200)

    def list_user_article(self, request, **kwargs):
        user =  get_object_or_404(User, id=kwargs.get('user_id'))
        article = Article.objects.filter(owner=user)
        serializer = ArticleSerializer(article, many=True)
        return Response(serializer.data, status=200)
    
    def article_details(self, request, **kwargs):
        articles = Article.objects.get(id=kwargs.get('article_id'))
        serializer = ArticleSerializer(articles)
        return Response(serializer.data, status=200)

    def delete_article(self, request, **kwargs):
        article = get_object_or_404(Article, id=kwargs.get('article_id'), owner=request.user)
        article.delete()
        return Response({}, status=202)
    
    def update_article(self, request, **kwargs):
        instance = get_object_or_404(Article, id=kwargs.get('article_id'), owner=request.user)
        data = request.data
        serializer = ArticleSerializer(instance, data=data)
        if serializer.is_valid():
            data = serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class CommentViewSet(viewsets.ViewSet):
    
    def create_comment(self, request, **kwargs):
        data = request.data
        user = request.user
        article =  get_object_or_404(Article, id=kwargs.get('article_id'))
        serializer = CommentSerializer(data=data)
        if serializer.is_valid():
            data = serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    
    def list_comments_article(self, request, **kwargs):
        article =  get_object_or_404(Article, id=kwargs.get('article_id'))
        comments = ArticleComments.objects.filter(article=article).order_by('-date_published')
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data, status=200)

    def list_comments(self, request, **kwargs):
        comments = ArticleComments.objects.all()
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data, status=200)
    
    def comment_details(self, request, **kwargs):
        comment = get_object_or_404(ArticleComments, id=kwargs.get('comment_id'))
        serializer = CommentSerializer(comment)
        return Response(serializer.data, status=200)
    
    def delete_comment(self, request, **kwargs):
        comment = get_object_or_404(ArticleComments, id=kwargs.get('comment_id'), owner=request.user)
        comment.delete()
        return Response({}, status=202)
    
    def update_comment(self, request, **kwargs):
        instance = get_object_or_404(ArticleComments, id=kwargs.get('comment_id'), owner=request.user)
        data = request.data
        serializer = CommentSerializer(instance, data=data)
        if serializer.is_valid():
            data = serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

class UserViewSet(viewsets.ViewSet):
    
    def create_user(self, request, **kwargs):
        data = request.data
        serializer = UserSerializer(data=data)
        if serializer.is_valid():
            data = serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    
    def list_user(self, request, **kwargs):
        user = User.objects.all()
        serializer = UserSerializer(user, many=True)
        return Response(serializer.data, status=200)

    def user_details(self, request, **kwargs):
        user = User.objects.get(id=kwargs.get('user_id'))
        serializer = UserSerializer(user)
        return Response(serializer.data, status=200)
    
    def update_user(self, request, **kwargs):
        instance = get_object_or_404(User, id=kwargs.get('user_id'))
        data = request.data
        serializer = UserSerializer(instance, data=data)
        if serializer.is_valid():
            data = serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

class LikeViewSet(viewsets.ViewSet):

    def list_like(self, request, **kwargs):
        like = ArticleLikes.objects.all()
        serializer = LikeSerializer(like, many=True)
        return Response(serializer.data, status=200)

    def like_details(self, request, **kwargs):
        like = ArticleLikes.objects.get(id=kwargs.get('like_id'))
        serializer = LikeSerializer(like)
        return Response(serializer.data, status=200)

    def list_user_liked_article(self, request, **kwargs):
        user =  get_object_or_404(User, id=kwargs.get('user_id'))
        likes = ArticleLikes.objects.filter(owner=request.user, likebool=True).order_by('-date_published')
        serializer = LikeSerializer(likes, many=True)
        return Response(serializer.data, status=200)

    def list_likes_article(self, request, **kwargs):
        article =  get_object_or_404(Article, id=kwargs.get('article_id'))
        like = ArticleLikes.objects.filter(article=article)
        serializer = LikeSerializer(like, many=True)
        return Response(serializer.data, status=200)
    
    def delete_like(self, request, **kwargs):
        like = get_object_or_404(ArticleLikes, id=kwargs.get('like_id'), owner=request.user)
        like.delete()
        return Response({}, status=202)
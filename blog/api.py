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
from .serializers import ArticleSerializer, CommentSerializer, LikeSerializer, FollowSerializer
from users.serializers import UserRegisterSerializer, UserSerializer, ChangePasswordSerializer
from rest_framework import viewsets
from rest_framework.response import Response

from django.db.models.functions import Lower

#TESTING
from rest_framework.pagination import PageNumberPagination, LimitOffsetPagination


    # article_list = Article.objects.all().order_by('-date_published')
    # paginator = Paginator(article_list, 10)
    # page = request.GET.get('page')
    # form = paginator.get_page(page)

# class StandardResultsSetPagination(PageNumberPagination):
#     page_size = 10
#     max_page_size = 10

class NewArticleViewSet(viewsets.ViewSet):

    def create_article(self, request, **kwargs):
        user = request.user
        serializer = ArticleSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(owner=user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    
    def list_articles(self, request, **kwargs):
        articles =  Article.objects.all()
        pagination_class = LimitOffsetPagination
        # paginator = Paginator(articles, 10)
        # page = request.GET.get('page')
        # form = paginator.get_page(page)
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
            data = serializer.save(article=article, owner=user)
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
        #data = request.data
        data =  request.data.copy()
        content_data = request.data.get('comment_content')
        data['content'] = content_data
        serializer = CommentSerializer(instance, data=data)
        if serializer.is_valid():
            data = serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    
    def total_comments_article(self, request, **kwargs):
        article =  get_object_or_404(Article, id=kwargs.get('article_id'))
        totalcomments = ArticleComments.objects.filter(article=article).count()
        return Response(totalcomments, status=200)

class UserViewSet(viewsets.ViewSet):
    
    def create_user(self, request, **kwargs):
        import pdb; pdb.set_trace()
        data = request.data
        serializer = UserRegisterSerializer(data=data)
        if serializer.is_valid():
            data = serializer.save()    
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    def change_password_user(self, request, **kwargs):
        if request.user.is_authenticated:
            user = get_object_or_404(User, id=request.user.id)
            serializer = ChangePasswordSerializer(data=request.data)
            if serializer.is_valid():
                old_password = serializer.data.get("old_password")
                if not user.check_password(old_password):
                    return Response({"old_password": ["Wrong password."]}, 
                                    status=400)
                user.set_password(serializer.data.get("new_password"))
                user.save()
                return Response(status=204)
            return Response(serializer.errors, status=400)
        else:
            return Http404("Invalid Access")
    
    def list_user(self, request, **kwargs):
        user = User.objects.all()
        serializer = UserSerializer(user, many=True)
        return Response(serializer.data, status=200)

    def user_details(self, request, **kwargs):
        user = User.objects.get(id=kwargs.get('user_id'))
        serializer = UserSerializer(user)
        return Response(serializer.data, status=200)
    
    def update_user(self, request, **kwargs):
        instance = get_object_or_404(User, id=request.user.id)
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
        like = ArticleLikes.objects.filter(article=article, likebool=True)
        serializer = LikeSerializer(like, many=True)
        return Response(serializer.data, status=200)

    def total_likes_article(self, request, **kwargs):
        article =  get_object_or_404(Article, id=kwargs.get('article_id'))
        totallikes = ArticleLikes.objects.filter(article=article, likebool=True).count()
        return Response(totallikes, status=200)

    def user_likes_article(self, request, **kwargs):
        article =  get_object_or_404(Article, id=kwargs.get('article_id'))
        userlike = ArticleLikes.objects.filter(article=article, likebool=True, owner=request.user)

        if not userlike:
            returnbool = False
        else:
            returnbool = True

        return Response(returnbool, status=200)
    
    def create_like(self, request, **kwargs):
        article = get_object_or_404(Article, id=kwargs.get('article_id'))
        owner = request.user
        data = request.data
        serializer = LikeSerializer(data=data)
        if serializer.is_valid():
            data = serializer.save(article=article, owner=owner)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    def delete_like(self, request, **kwargs):
        article = get_object_or_404(Article, id=kwargs.get('article_id'))
        like = get_object_or_404(ArticleLikes, article=article, owner=request.user)
        like.delete()
        return Response({}, status=202)

class FollowViewSet(viewsets.ViewSet):

    def list_follow(self, request, **kwargs):
        follow = UserFollowing.objects.all()
        serializer = FollowSerializer(follow, many=True)
        return Response(serializer.data, status=200)
    
    def user_follows_list(self, request, **kwargs):
        user = UserFollowing.objects.filter(owner=kwargs.get('user_id'))
        serializer = FollowSerializer(user, many=True)
        return Response(serializer.data, status=200)
    
    def user_followers_list(self, request, **kwargs):
        user = UserFollowing.objects.filter(following=kwargs.get('user_id'))
        serializer = FollowSerializer(user, many=True)
        return Response(serializer.data, status=200)
        
    def total_user_following(self, request, **kwargs):
        followingtotal = UserFollowing.objects.filter(owner=kwargs.get('user_id')).count()
        return Response(followingtotal, status=200)

    def total_user_follower(self, request, **kwargs):
        followertotal = UserFollowing.objects.filter(following=kwargs.get('user_id')).count()
        return Response(followertotal, status=200)  

    def owner_follows_user(self, request, **kwargs):
        user = get_object_or_404(User, id=kwargs.get('user_id'))
        if request.user.is_authenticated:
            userfollow = UserFollowing.objects.filter(following = user, followbool=True, owner=request.user)
            if not userfollow:
                returnbool = False
            else:
                returnbool = True
        else:
            returnbool = False
        return Response(returnbool, status=200)

    def create_follow(self, request, **kwargs):
        follow = get_object_or_404(User, id=kwargs.get('user_id'))
        owner = request.user
        data = request.data
        serializer = FollowSerializer(data=data)
        if serializer.is_valid():
            data = serializer.save(following=follow, owner=owner)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    
    def delete_follow(self, request, **kwargs):
        follow = get_object_or_404(User, id=kwargs.get('user_id'))
        owner = request.user
        data = get_object_or_404(UserFollowing, following=follow, owner=owner)
        data.delete()
        return Response({}, status=202)


class SearchViewSet(viewsets.ViewSet):

    def search_article(self, request, **kwargs):
        context = request.GET.get('search')
        article = Article.objects.filter(title__contains=context)
        if(article):
            serializer = ArticleSerializer(article, many=True)
            return Response(serializer.data, status=202)
        return Response({'error':'Does not exist'}, status=400)

    def search_user(self, request, **kwargs):
        context = request.GET.get('search')
        user = User.objects.filter(firstname__contains=context)
        if(user):
            serializer = UserSerializer(user, many=True)
            return Response(serializer.data, status=202)
        return Response({'error':'Does not exist'}, status=400)
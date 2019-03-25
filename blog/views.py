from django.shortcuts import (
    Http404,
    render, 
    HttpResponse, 
    redirect, 
    get_object_or_404, 
    HttpResponseRedirect)
from .forms import AddArticleForm, UpdateArticleForm, AddComment, EditComment
from .models import Article, FeaturedArticle, ArticleComments, ArticleLikes, UserFollowing
from django.core.paginator import Paginator
from django.db.models import Count
from users.models import User
# Create your views here.

def home_page(request):
    #featured = FeaturedArticle.objects.order_by('?')[:3]
    #featured = Article.objects.filter(is_featured=True).order_by('?').annotate(number_of_likes=Count('articlelikes', distinct=True)).annotate(number_of_comment=Count('articlecomments', distinct=True))[:3]
    #featured = Article.objects.filter(is_featured=True).order_by('?').annotate(number_of_likes=Count('articlelikes', distinct=True),number_of_comment=Count('articlecomments', distinct=True))[:3]
    #article_list = Article.objects.annotate(number_of_likes=Count('articlelikes', distinct=True)).annotate(number_of_comment=Count('articlecomments', distinct=True)).order_by('-date_published')
    featured = Article.objects.filter(is_featured=True).order_by('?')[:3]
    article_list = Article.objects.all().order_by('-date_published')
    paginator = Paginator(article_list, 10)
    page = request.GET.get('page')
    form = paginator.get_page(page)
    return render(request, 'blog/homepage.html', {'form': form, 'featured':featured})

def add_article(request):
    if request.user.is_authenticated:
        if request.method == 'POST':
            data = {'owner':request.user}
            form = AddArticleForm(request.POST, request.FILES, initial=data)
            if form.is_valid():
                addArticle = form.save(commit=False)
                addArticle.owner = request.user
                form.save()
                return redirect('blog:homepage')
        else:
            form = AddArticleForm()

        return render(request, 'blog/addarticle.html', {'form': form})
    else:
        return redirect('users:login')

def edit_article(request, article_id):
    if request.user.is_authenticated:
        qs = Article.objects.get(pk=article_id)
        data = {'article_image': qs.article_image,
                'title': qs.title,
                'description': qs.description}
        if request.user == qs.owner:
            if request.method == 'POST':
                form = UpdateArticleForm(request.POST, request.FILES, initial=data, instance=qs)
                if form.is_valid():
                        form.save()
                        return redirect('blog:userarticle')
                else:
                    form = UpdateArticleForm(initial=data)
            else:
                form = UpdateArticleForm(initial=data)

            return render(request, 'blog/editarticle.html', {'form': form})
        else:
            raise Http404("INVALID ACCESS")
    else:
        return redirect('users:login')

def delete_article(request, article_id):
    if request.user.is_authenticated:
        article = get_object_or_404(Article, pk=article_id, owner=request.user)
        article.delete()
        return redirect('blog:userarticle')
    else:
        return redirect('users:login')

def article_details(request, article_id):
    form = Article.objects.filter(pk=article_id)
    instance = get_object_or_404(Article, pk=article_id)
    commentForm = AddComment()
    loadComment = ArticleComments.objects.filter(article=instance).order_by('date_published')
    if request.user.is_authenticated:
        likes = ArticleLikes.objects.filter(article=instance, owner=request.user)
        totallikes = ArticleLikes.objects.filter(article=instance, likebool=True).count()
        return render(request, 'blog/articledetails.html', {'form': form, 
        'commentForm': commentForm, 'loadComment':loadComment, 'likes':likes,
        'totallikes':totallikes})
    else:
        return render(request, 'blog/articledetails.html', {'form': form, 
        'commentForm': commentForm, 'loadComment':loadComment})

def comment_add(request, article_id):
    if request.user.is_authenticated:
        if request.method == 'POST':
            commentForm = AddComment(request.POST)
            if commentForm.is_valid():
                article = get_object_or_404(Article, pk=article_id)
                addComment = commentForm.save(commit=False)
                addComment.owner = request.user
                addComment.article = article
                commentForm.save()
            return redirect('blog:articledetails', article_id)
        else:
            return redirect('blog:articledetails', article_id)
    else:
        raise Http404("INVALID ACCESS")

def comment_edit(request, comment_id):
    if request.user.is_authenticated:
        comments = get_object_or_404(ArticleComments, pk=comment_id, owner=request.user)
        article = get_object_or_404(Article, pk=comments.article.id)
        data = {'content': comments.content}
        form = EditComment(initial=data)
        if request.method == 'POST':
            commentForm = EditComment(request.POST, instance=comments)
            if commentForm.is_valid():
                commentForm.save()
            return redirect('blog:articledetails', article.id)
        else:
            return render(request, 'blog/editcomment.html', {'form': form})
    else:
        raise Http404("INVALID ACCESS")

def comment_delete(request, comment_id):
    if request.user.is_authenticated:
        comment = get_object_or_404(ArticleComments, pk=comment_id, owner=request.user)
        article = get_object_or_404(Article, pk=comment.article.id)
        comment.delete()
        return redirect('blog:articledetails', article.id)
    else:
        raise Http404("INVALID ACCESS")

def article_like(request, article_id):
    if request.user.is_authenticated:
        article = get_object_or_404(Article, pk=article_id)
        likes = ArticleLikes.objects.filter(article=article, owner=request.user)
        if not likes:
            ArticleLikes.objects.create(likebool=True, article=article, owner=request.user)
        else:
            for like in likes:
                if like.likebool == True:
                    ArticleLikes.objects.filter(id = like.id).update(likebool = False)
                else:
                    ArticleLikes.objects.filter(id = like.id).update(likebool = True)

        return redirect('blog:articledetails', article.id)
    else:
        raise Http404("INVALID ACCESS")

def view_liked(request):
    if request.user.is_authenticated:
        form = ArticleLikes.objects.filter(owner=request.user, likebool=True).order_by('-date_published')
        return render(request, 'blog/likedarticlesview.html', {'form': form})
    else:
        raise Http404("INVALID ACCESS")

def user_articles(request, user_id):
    user = User.objects.get(pk=user_id)
    form = Article.objects.filter(owner=user_id).order_by('-date_published')
    if request.user.is_authenticated:
        follow = UserFollowing.objects.filter(following=user, owner=request.user)
        return render(request, 'blog/userarticles.html', {'form': form, 'user':user, 'follow':follow})
    else:
        return render(request, 'blog/userarticles.html', {'form': form, 'user':user})

def user_follow(request, user_id):
    if request.user.is_authenticated:
        user = get_object_or_404(User, pk=user_id)
        follow = UserFollowing.objects.filter(following=user, owner=request.user)
        
        if not follow:
            UserFollowing.objects.create(followbool=True, following=user, owner=request.user)
        else:
            for fllw in follow:
                if fllw.followbool == True:
                    UserFollowing.objects.filter(id = fllw.id).delete()
                else:
                    UserFollowing.objects.filter(id = fllw.id).update(followbool = True)

        return redirect('blog:userarticle', user_id)
    else:
        raise Http404("INVALID ACCESS")

def view_liked(request):
    if request.user.is_authenticated:
        form = ArticleLikes.objects.filter(owner=request.user, likebool=True).order_by('-date_published')
        return render(request, 'blog/likedarticlesview.html', {'form': form})
    else:
        raise Http404("INVALID ACCESS")

# def edit_article(request, article_id):
#     if request.user.is_authenticated:
#         qs = Article.objects.get(pk=article_id)
#         data = {'articleid': article_id,
#                 'title': qs.title,
#                 'description': qs.description}
#         if request.user == qs.owner:
#             if request.method == 'POST':
#                 form = UpdateArticleForm(request.POST, initial=data)
#                 if form.is_valid():
#                         form.update(request)
#                 else:
#                     form = UpdateArticleForm(initial=data)
#             else:
#                 form = UpdateArticleForm(initial=data)

#             return render(request, 'blog/editarticle.html', {'form': form})
#         else:
#             raise Http404("INVALID ACCESS")
#     else:
#         return redirect('users:login')

# def home_page(request):
#     if request.user.is_authenticated:
#         form = Article.objects.order_by('-date_published')
#         return render(request, 'blog/homepage.html', {'form': form})
#     else:
#         return redirect('users:login')

# def home_page(request):
#     featured = FeaturedArticle.objects.order_by('?')[:3]
#     article_list = Article.objects.all().order_by('-date_published')
#     import pdb; pdb.set_trace()
#     paginator = Paginator(article_list, 10)
#     page = request.GET.get('page')
#     form = paginator.get_page(page)
#     return render(request, 'blog/homepage.html', {'form': form, 'featured':featured})

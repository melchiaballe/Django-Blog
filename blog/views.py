from django.shortcuts import (
    Http404,
    render, 
    HttpResponse, 
    redirect, 
    get_object_or_404, 
    HttpResponseRedirect)
from .forms import AddArticleForm, UpdateArticleForm, AddComment
from .models import Article, FeaturedArticle, ArticleComments
from django.core.paginator import Paginator
# Create your views here.

def home_page(request):
    featured = FeaturedArticle.objects.order_by('?')[:3]
    article_list = Article.objects.all().order_by('-date_published')
    paginator = Paginator(article_list, 10)
    page = request.GET.get('page')
    form = paginator.get_page(page)
    return render(request, 'blog/homepage.html', {'form': form, 'featured':featured})


def user_articles(request):
    if request.user.is_authenticated:
        form = Article.objects.filter(owner=request.user).order_by('-date_published')
        return render(request, 'blog/userarticles.html', {'form': form})
    else:
        return redirect('users:login')

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
    commentForm = AddComment()
    loadComment = ArticleComments.objects.all().order_by('date_published')
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

def comment_delete(request, comment_id, article_id):
    if request.user.is_authenticated:
        comment = get_object_or_404(ArticleComments, pk=comment_id, owner=request.user)
        comment.delete()
        return redirect('blog:articledetails', article_id)
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
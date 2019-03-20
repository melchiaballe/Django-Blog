from django.shortcuts import (
    Http404,
    render, 
    HttpResponse, 
    redirect, 
    get_object_or_404, 
    HttpResponseRedirect)
from .forms import AddArticleForm, UpdateArticleForm
from .models import Article
# Create your views here.

def home_page(request):
    if request.user.is_authenticated:
        form = Article.objects.order_by('-date_published')
        return render(request, 'blog/homepage.html', {'form': form})
    else:
        return redirect('users:login')

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
            form = AddArticleForm(request.POST, initial=data)
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
        data = {'articleid': article_id,
                'title': qs.title,
                'description': qs.description}
        if request.user == qs.owner:
            if request.method == 'POST':
                form = UpdateArticleForm(request.POST, initial=data)
                if form.is_valid():
                        form.update(request)
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
    if request.user.is_authenticated:
        form = Article.objects.filter(pk=article_id)
        return render(request, 'blog/articledetails.html', {'form': form})
    else:
        return redirect('users:login')

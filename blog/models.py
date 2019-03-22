from django.db import models
from django.conf import settings

# Create your models here.

class Article(models.Model):
    title =  models.CharField(max_length = 200)
    description = models.TextField()
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    date_published = models.DateTimeField(auto_now_add = True)
    date_modified = models.DateTimeField(auto_now = True)
    article_image = models.ImageField(upload_to='articleImage/', null=True, blank=True)
    
    def __str__(self):
        return self.title

class FeaturedArticle(models.Model):
    article = models.ForeignKey(Article, on_delete=models.CASCADE)

    def __str__(self):
        return self.article.title

class ArticleComments(models.Model):
    content = models.TextField()
    article = models.ForeignKey(Article, on_delete=models.CASCADE)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    date_published = models.DateTimeField(auto_now_add = True)
    date_modified = models.DateTimeField(auto_now = True)

    def __str__(self):
        return self.article.title +" : " + self.content

class ArticleLikes(models.Model):
    likebool = models.BooleanField()
    article = models.ForeignKey(Article, on_delete=models.CASCADE)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    date_published = models.DateTimeField(auto_now_add = True)
    date_modified = models.DateTimeField(auto_now = True)

    def __str__(self):
        return self.article.title +" : " + self.owner.get_short_name()
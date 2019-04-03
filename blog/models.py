from django.db import models
from django.conf import settings
from django.db.models import Count

from taggit.managers import TaggableManager

# Create your models here.

class Article(models.Model):
    title =  models.CharField(max_length = 200)
    description = models.TextField()
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    date_published = models.DateTimeField(auto_now_add = True)
    date_modified = models.DateTimeField(auto_now = True)
    article_image = models.ImageField(upload_to='articleImage/', null=True, blank=True)
    is_featured = models.BooleanField(default=False)

    tags = TaggableManager(blank=True)

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

    def number_of_comments(self):
        return Count(self.id)

class ArticleLikes(models.Model):
    likebool = models.BooleanField()
    article = models.ForeignKey(Article, on_delete=models.CASCADE)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    date_published = models.DateTimeField(auto_now_add = True)
    date_modified = models.DateTimeField(auto_now = True)

    def __str__(self):
        return self.article.title +" : " + self.owner.get_short_name()

    def number_of_likes(self):
        return Count(self.id)

class UserFollowing(models.Model):
    followbool = models.BooleanField()
    following = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name = 'following', unique=True)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name = 'user')
    date_follow = models.DateTimeField(auto_now_add = True)
    date_modified = models.DateTimeField(auto_now = True)

    def __str__(self):
        return self.owner.get_short_name() +" :follows: " + self.following.firstname

    def number_of_followers(self):
        return Count(self.id)
from django.contrib import admin
from .models import Article, FeaturedArticle, ArticleComments, ArticleLikes, UserFollowing

# Register your models here.
admin.site.register(Article)
admin.site.register(FeaturedArticle)
admin.site.register(ArticleComments)
admin.site.register(ArticleLikes)
admin.site.register(UserFollowing)
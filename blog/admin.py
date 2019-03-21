from django.contrib import admin
from .models import Article, FeaturedArticle, ArticleComments

# Register your models here.
admin.site.register(Article)
admin.site.register(FeaturedArticle)
admin.site.register(ArticleComments)
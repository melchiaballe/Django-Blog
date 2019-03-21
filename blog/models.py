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
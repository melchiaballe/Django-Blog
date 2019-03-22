from django import forms
from django.db import models
from django.forms import ModelForm
from .models import Article, ArticleComments
from django.conf import settings

class AddArticleForm(ModelForm):
    title = forms.CharField(label="Title", widget=forms.TextInput(attrs={'placeholder':'Title'}), max_length=200)
    article_image = forms.ImageField(required=False)
    description = forms.CharField(label="Content", widget=forms.Textarea(attrs={'placeholder':'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris'}))

    class Meta:
        model = Article
        fields = ['title', 'article_image', 'description']

class UpdateArticleForm(ModelForm):
    title = forms.CharField(label="Title", widget=forms.TextInput(attrs={'placeholder':'Title'}), max_length=200)
    article_image = forms.ImageField(required=False)
    description = forms.CharField(label="Content", widget=forms.Textarea(attrs={'placeholder':'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris'}))

    class Meta:
        model = Article
        fields = ['title', 'article_image', 'description']

class AddComment(ModelForm):
    content = forms.CharField(label="Comment", widget=forms.TextInput(attrs={'placeholder':'Enter a Comment'}))
    
    class Meta:
        model = ArticleComments
        fields = ['content']

class EditComment(ModelForm):
    content = forms.CharField(label="Comment", widget=forms.TextInput(attrs={'placeholder':'Enter a Comment'}))
    
    class Meta:
        model = ArticleComments
        fields = ['content']
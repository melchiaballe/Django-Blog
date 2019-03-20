from django import forms
from django.db import models
from django.forms import ModelForm
from .models import Article
from django.conf import settings

class AddArticleForm(ModelForm):
    title = forms.CharField(label="Title", widget=forms.TextInput(attrs={'placeholder':'Title'}), max_length=200)
    description = forms.CharField(label="Content", widget=forms.Textarea(attrs={'placeholder':'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris'}))

    class Meta:
        model = Article
        fields = ['title', 'description']

class UpdateArticleForm(forms.Form):
    articleid = forms.CharField(widget=forms.HiddenInput())
    title = forms.CharField(label="Title", widget=forms.TextInput(attrs={'placeholder':'Title'}), max_length=200)
    description = forms.CharField(label="Content", widget=forms.Textarea(attrs={'placeholder':'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris'}))

    def update(self, request):
        articleid = self.cleaned_data.get('articleid')
        title = self.cleaned_data.get('title')
        description = self.cleaned_data.get('description')
        Article.objects.filter(pk=articleid, owner=request.user).update(title=title, description=description)

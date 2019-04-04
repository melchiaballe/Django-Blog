from rest_framework import serializers
from .models import Article, ArticleComments, ArticleLikes, UserFollowing
from users.serializers import UserSerializer

from rest_framework.pagination import PageNumberPagination

# class StandardResultsSetPagination(PageNumberPagination):
#     page_size = 10
#     max_page_size = 10

# class TagSerializerField(serializers.ListField):
#     child = serializers.CharField()

#     def to_representation(self, data):
#         return data.values_list('name', flat=True)

# class TagSerializer(serializers.ModelSerializer):
#     tags = TagSerializerField()

#     def create(self, validated_data):
#         tags = validated_data.pop('tags')
#         instance = super(TagSerializer, self).create(validated_data)
#         instance.tags.set(*tags)
#         return instance

class TagSerializerField(serializers.ListField):
    def to_internal_value(self, data):
        if type(data) is not list:
            raise ("expected a list of data")
        return data

    def to_representation(self, obj):
        if type(obj) is not list:
            return [tag.name for tag in obj.all()]
        return obj
        
class TagSerializer(serializers.ModelSerializer):
    tags = TagSerializerField()

    def create(self, validated_data):
        if 'tags' in validated_data:
            tags = validated_data.pop('tags')
            tagCont = ''.join(str(e) for e in tags)
            tagCont = tagCont.replace(',',' ')
            tags = tagCont.split(" ")
            instance = super(TagSerializer, self).create(validated_data)
            instance.tags.set(*tags)
        else:
            instance = super(TagSerializer, self).create(validated_data)
        return instance
    
    def update(self, instance, validated_data):
        if 'tags' in validated_data:
            tags = validated_data.pop('tags')
            tagCont = ''.join(str(e) for e in tags)
            tagCont = tagCont.replace(',',' ')
            tags = tagCont.split(" ")
            instance = super(TagSerializer, self).update(instance, validated_data)
            instance.tags.set(*tags)
        else:
            instance = super(TagSerializer, self).update(instance, validated_data)
        return instance

class ArticleSerializer(TagSerializer, serializers.ModelSerializer):
    #owner = serializers.ReadOnlyField(source='owner.username')
    #pagination_class = PageNumberPagination
    owner = UserSerializer(read_only=True)
    tags = TagSerializerField(required=False)

    class Meta:
        model = Article
        fields = ['id', 'title', 'article_image', 'description', 'is_featured', 'owner', 'tags']
        #read_only_fields = ('owner',)

class CommentSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    article = ArticleSerializer(read_only=True)

    class Meta:
        model = ArticleComments
        fields = ['id', 'content', 'article', 'owner']

class LikeSerializer(serializers.ModelSerializer):

    owner = UserSerializer(read_only=True)
    article = ArticleSerializer(read_only=True)
    
    class Meta:
        model = ArticleLikes
        fields = ['id', 'likebool', 'article', 'owner']

class FollowSerializer(serializers.ModelSerializer):
    following = UserSerializer(read_only=True)
    owner = UserSerializer(read_only=True)
    
    class Meta:
        model = UserFollowing
        fields = ['id', 'followbool', 'following', 'owner']
# Generated by Django 2.1.7 on 2019-03-25 02:59

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0009_userfollowing'),
    ]

    operations = [
        migrations.AddField(
            model_name='userfollowing',
            name='owner',
            field=models.ManyToManyField(related_name='follows', to='blog.UserFollowing'),
        ),
        migrations.AlterField(
            model_name='userfollowing',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user', to=settings.AUTH_USER_MODEL, unique=True),
        ),
    ]

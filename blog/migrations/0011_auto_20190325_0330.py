# Generated by Django 2.1.7 on 2019-03-25 03:30

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('blog', '0010_auto_20190325_0259'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='userfollowing',
            name='user',
        ),
        migrations.AddField(
            model_name='userfollowing',
            name='following',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='following', to=settings.AUTH_USER_MODEL),
            preserve_default=False,
        ),
        migrations.RemoveField(
            model_name='userfollowing',
            name='owner',
        ),
        migrations.AddField(
            model_name='userfollowing',
            name='owner',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='user', to=settings.AUTH_USER_MODEL),
            preserve_default=False,
        ),
    ]
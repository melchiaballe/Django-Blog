# Generated by Django 2.1.7 on 2019-03-19 06:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_auto_20190319_0244'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='about_me',
            field=models.TextField(blank=True, verbose_name='about me'),
        ),
    ]

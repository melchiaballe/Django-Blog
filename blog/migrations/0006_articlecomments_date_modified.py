# Generated by Django 2.1.7 on 2019-03-21 09:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0005_articlecomments'),
    ]

    operations = [
        migrations.AddField(
            model_name='articlecomments',
            name='date_modified',
            field=models.DateTimeField(auto_now=True),
        ),
    ]

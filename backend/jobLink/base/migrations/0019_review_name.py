# Generated by Django 5.0.6 on 2024-08-02 19:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0018_worker_cover_photo'),
    ]

    operations = [
        migrations.AddField(
            model_name='review',
            name='name',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
    ]

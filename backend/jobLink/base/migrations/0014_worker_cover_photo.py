# Generated by Django 5.0.6 on 2024-08-01 09:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0013_remove_category_participants'),
    ]

    operations = [
        migrations.AddField(
            model_name='worker',
            name='cover_photo',
            field=models.ImageField(blank=True, default='/images/placeholder.png', null=True, upload_to='cover_photos/'),
        ),
    ]

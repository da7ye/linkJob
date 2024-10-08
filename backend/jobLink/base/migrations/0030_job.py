# Generated by Django 5.0.6 on 2024-08-12 12:18

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0029_alter_worker_payment_type'),
    ]

    operations = [
        migrations.CreateModel(
            name='Job',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('description', models.TextField()),
                ('more_details', models.TextField()),
                ('location', models.CharField(max_length=255)),
                ('payment_expected', models.DecimalField(decimal_places=2, max_digits=10)),
                ('date_posted', models.DateTimeField(auto_now_add=True)),
                ('categories_interested', models.ManyToManyField(to='base.category')),
                ('employer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]

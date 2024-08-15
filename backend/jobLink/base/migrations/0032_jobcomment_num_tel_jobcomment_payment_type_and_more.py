# Generated by Django 5.0.6 on 2024-08-14 10:05

import phonenumber_field.modelfields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0031_jobcomment'),
    ]

    operations = [
        migrations.AddField(
            model_name='jobcomment',
            name='num_tel',
            field=phonenumber_field.modelfields.PhoneNumberField(blank=True, max_length=128, region=None),
        ),
        migrations.AddField(
            model_name='jobcomment',
            name='payment_type',
            field=models.CharField(choices=[('Per Hour', 'Per Hour'), ('Per Mission', 'Per Mission')], default='PH', max_length=12),
        ),
        migrations.AddField(
            model_name='jobcomment',
            name='tools_needed',
            field=models.TextField(blank=True, null=True),
        ),
    ]

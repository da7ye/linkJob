# Generated by Django 5.0.6 on 2024-08-14 10:08

import phonenumber_field.modelfields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0033_remove_jobcomment_num_tel_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='job',
            name='LANGUAGE_CHOICES',
            field=models.ManyToManyField(to='base.language'),
        ),
        migrations.AddField(
            model_name='job',
            name='num_tel',
            field=phonenumber_field.modelfields.PhoneNumberField(blank=True, max_length=128, region=None),
        ),
        migrations.AddField(
            model_name='job',
            name='payment_type',
            field=models.CharField(choices=[('Per Hour', 'Per Hour'), ('Per Mission', 'Per Mission')], default='PH', max_length=12),
        ),
        migrations.AddField(
            model_name='job',
            name='tools_needed',
            field=models.TextField(blank=True, null=True),
        ),
    ]

# Generated by Django 5.0.6 on 2024-08-14 10:27

import django.db.models.deletion
import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0034_job_language_choices_job_num_tel_job_payment_type_and_more'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='ExtraImage',
            new_name='WorkerExtraImage',
        ),
        migrations.RemoveField(
            model_name='job',
            name='LANGUAGE_CHOICES',
        ),
        migrations.AddField(
            model_name='job',
            name='speaked_luanguages',
            field=models.CharField(choices=[('arabe', 'العربية'), ('francais', 'Français'), ('english', 'English'), ('polar', 'polar'), ('wolof', 'wolof')], default=django.utils.timezone.now, max_length=50),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='language',
            name='name',
            field=models.CharField(choices=[('arabe', 'العربية'), ('francais', 'Français'), ('english', 'English'), ('polar', 'polar'), ('wolof', 'wolof')], max_length=50),
        ),
        migrations.CreateModel(
            name='JobExtraImage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to='extra_images/')),
                ('job', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='extra_images', to='base.job')),
            ],
        ),
    ]

from django.db import models
from django.contrib.auth.models import AbstractUser, PermissionsMixin
from django.utils.translation import gettext_lazy as _
from .managers import CustomUserManager
from phonenumber_field.modelfields import PhoneNumberField
from django.core.exceptions import ValidationError



class User(AbstractUser, PermissionsMixin):
    username = None
    first_name = models.CharField(_('First name'), max_length=100)
    last_name = models.CharField(_('last name'), max_length=100)
    email = models.EmailField(_('Email Address'), max_length=254, unique=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name"]
    objects = CustomUserManager()
    class Meta:
        verbose_name = _("User")
        verbose_name_plural = _("Users")
    def __str__(self):
        return self.email
    @property
    def get_full_name(self):
        return f"{self.first_name} {self.last_name}"


class Category(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    date_posted = models.DateTimeField(auto_now_add=True)
    image = models.ImageField(upload_to='category_images/', blank=True)
    _id = models.AutoField(primary_key=True, editable=False)

    def __str__(self):
        return self.title

class Worker(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    categories = models.ManyToManyField(Category, related_name='workers')
    rating = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    numReviews = models.IntegerField(null=True, blank=True, default=0)
    pricePerHour = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    gender_choices = [
        ('M', 'Male'),
        ('F', 'Female'),
    ]
    gender = models.CharField(max_length=1, choices=gender_choices)
    profile_photo = models.ImageField(upload_to='profile_photos/', null=True, blank=True)
    cover_photo = models.ImageField(upload_to='cover_photos/',default = "cover_photos/placeholder.png", null=True, blank=True)
    # num_tel = models.CharField(max_length=20)
    num_tel = PhoneNumberField(blank=True)

    small_description = models.TextField(null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    _id = models.AutoField(primary_key=True, editable=False)
    # activate worker
    is_active = models.BooleanField(default=False)
    def __str__(self):
        return f"{self.user.email} - {self.num_tel}"

class ExtraImage(models.Model):
    image = models.ImageField(upload_to='extra_images/')
    worker = models.ForeignKey(Worker, related_name='extra_images', on_delete=models.CASCADE)

    def __str__(self):
        return f"Image {self.id} for {self.worker.user.email}"


class Language(models.Model):
    LANGUAGE_CHOICES = [
        ('arabe', 'العربية'),
        ('francais', 'Français'),
        ('english', 'English'),
    ]

    name = models.CharField(max_length=50, choices=LANGUAGE_CHOICES)
    worker = models.ForeignKey(Worker, related_name='languages', on_delete=models.CASCADE)

    def __str__(self):
        return self.get_name_display()


class Education(models.Model):
    title = models.CharField(max_length=255)
    institution = models.CharField(max_length=255)
    date_started = models.DateTimeField()
    date_ended = models.DateTimeField()
    worker = models.ForeignKey(Worker, related_name='educations', on_delete=models.CASCADE)

    def __str__(self):
        return self.title

    def clean(self):
        super().clean()  # Call the base class's clean method
        if self.date_started and self.date_ended:
            if self.date_started >= self.date_ended:
                raise ValidationError('Start date must be before end date.')

    def save(self, *args, **kwargs):
        self.clean()  # Ensure validation occurs before saving
        super().save(*args, **kwargs)


class Certificate(models.Model):
    title = models.CharField(max_length=255)
    issued_by = models.CharField(max_length=255)
    date_issued = models.DateField()
    worker = models.ForeignKey(Worker, related_name='certificates', on_delete=models.CASCADE)

    def __str__(self):
        return self.title

        

class Review(models.Model):
    reviewer = models.ForeignKey(User, on_delete=models.SET_NULL,null=True, related_name='reviewer')
    worker = models.ForeignKey(Worker, on_delete=models.CASCADE)
    # job = models.ForeignKey(Job, on_delete=models.CASCADE)
    name = models.CharField(max_length=200,null=True,blank=True)

    rating =  models.IntegerField(null=True,blank=True,default=0)
    comment = models.TextField(null=True,blank=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    _id =  models.AutoField(primary_key=True,editable=False)



    def __str__(self):
        return str(self.rating)



# class Job(models.Model):
#     employer = models.ForeignKey(EmployerProfile, on_delete=models.CASCADE)
#     title = models.CharField(max_length=255)
#     description = models.TextField()
#     location = models.CharField(max_length=255)
#     payment = models.DecimalField(max_digits=10, decimal_places=2)
#     date_posted = models.DateTimeField(auto_now_add=True)
    
#     def __str__(self):
#         return self.title

# class Application(models.Model):
#     job = models.ForeignKey(Job, on_delete=models.CASCADE)
#     worker = models.ForeignKey(WorkerProfile, on_delete=models.CASCADE)
#     status = models.CharField(max_length=50, default='Pending')

#     def __str__(self):
#         return f"Application by {self.worker.user.username} for {self.job.title}"


# class Message(models.Model):
#     sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sender')
#     receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='receiver')
#     content = models.TextField()
#     timestamp = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f"Message from {self.sender.username} to {self.receiver.username}"

# class Payment(models.Model):
#     job = models.OneToOneField(Job, on_delete=models.CASCADE)
#     amount = models.DecimalField(max_digits=10, decimal_places=2)
#     date = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f"Payment for {self.job.title} of amount {self.amount}"

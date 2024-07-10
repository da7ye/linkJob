from django.db import models
from django.db import models
from django.contrib.auth.models import AbstractUser, PermissionsMixin
from django.utils.translation import gettext_lazy as _
from .managers import CustomUserManager

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


class Worker(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    num_tel = models.CharField(max_length=20)
    skills = models.TextField()
    rating = models.FloatField(default=0.0)
    reviews = models.TextField(blank=True, null=True)
    comments = models.TextField(blank=True, null=True)

    numReviews = models.IntegerField(null=True,blank=True,default=0)
    price = models.DecimalField(max_digits=12,decimal_places=2,null=True,blank=True)
    _id = models.AutoField(primary_key=True,editable=False)


    def __str__(self):
        return f"{self.user.email} - {self.num_tel}"


class Category(models.Model):
    Worker = models.ForeignKey(Worker, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField()
    smallDesc = models.TextField()
    location = models.CharField(max_length=255)
    payment = models.DecimalField(max_digits=10, decimal_places=2)
    date_posted = models.DateTimeField(auto_now_add=True)
    _id = models.AutoField(primary_key=True,editable=False)


# class EmployerProfile(models.Model):
#     user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
#     company_name = models.CharField(max_length=255)

#     def __str__(self):
#         return self.user.username

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

# class Review(models.Model):
#     reviewer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviewer')
#     worker = models.ForeignKey(WorkerProfile, on_delete=models.CASCADE)
#     job = models.ForeignKey(Job, on_delete=models.CASCADE)
#     rating = models.IntegerField()
#     comments = models.TextField()

#     def __str__(self):
#         return f"Review by {self.reviewer.username} for {self.worker.user.username}"

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

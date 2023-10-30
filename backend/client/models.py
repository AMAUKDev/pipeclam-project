from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager

class Device(models.Model):
    name = models.CharField(max_length=255)
    group = models.CharField(max_length=255)
    device_guid = models.CharField(max_length=255)
    type = models.CharField(max_length=255)

    def __str__(self):
        return self.device_guid


class Tag(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class ClientManager(BaseUserManager):
    def create_user(self, first_name: str,
                          last_name: str,
                          email: str,
                          role: str,
                          password: str = None,
                          approved=False,
                          is_staff=False,
                          is_superuser=False) -> 'Client':
        
        # Validations for the user inputs
        if not email:
            raise ValueError("Users must have an email address")
        if not first_name:
            raise ValueError("Users must have a first name")
        if not last_name:
            raise ValueError("Users must have a last name")
        
        user = self.model(email=self.normalize_email(email))
        user.first_name = first_name
        user.last_name = last_name
        user.set_password(password)
        user.is_staff = is_staff
        user.is_superuser = is_superuser
        user.approved = approved

        user.role = role

        user.save(using=self._db)

        return user
    
    def create_superuser(self, first_name: str,
                          last_name: str,
                          email: str,
                           password: str = None, role='Admin') -> 'Client':
        user = self.create_user(
            first_name=first_name,
            last_name=last_name,
            email=email,
            role=role,
            password=password,
            is_staff=True,
            is_superuser=True,
            approved=True,
            
        )
        user.save(using=self._db)
        return user

class Client(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = 'ADMIN', 'Admin'
        AMA = 'AMA', 'Andrew Moore and Associates'
        CMA = 'CMA', 'CMA'
        PIPECLAM = 'PIPECLAM', 'Pipeclam'
        Unapproved = 'Unapproved', 'Unapproved'

    base_role = Role.Unapproved
    
    approved = models.BooleanField(default=False)

    first_name = models.CharField(verbose_name='First Name', max_length=50)
    last_name = models.CharField(verbose_name='Last Name', max_length=50)
    email = models.EmailField(unique=True, max_length=255)
    group = models.CharField(max_length=100, blank=True)
    password = models.CharField(max_length=255)
    username = None
    role = models.CharField(max_length=10, choices=Role.choices, default=base_role)
    # Attach to UserManager
    tags = models.ManyToManyField(Tag, blank=True)
    objects = ClientManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'password']

    class Meta:
        verbose_name_plural = "Clients"
 

    def __str__(self) -> str:
        return self.email
  
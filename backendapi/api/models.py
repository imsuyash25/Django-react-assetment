from django.db import models
from django.contrib.auth.models import AbstractUser,  BaseUserManager
from django.utils import timezone
import uuid


class UserManager(BaseUserManager):
    def _create_user(self, username, password, is_staff,
                     is_superuser, **extra_fields):

        user = self.model(
            username=username,
            is_staff=is_staff,
            is_active=True,
            is_superuser=is_superuser,
            last_login=timezone.now(),
            **extra_fields,
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, username, password, **extra_fields):
        is_staff = extra_fields.pop("is_staff", False)
        is_superuser = extra_fields.pop("is_superuser", False)
        return self._create_user(
            username, password, is_staff, is_superuser, **extra_fields)

    def create_superuser(self, username, password, **extra_fields):
        return self._create_user(
            username,
            password,
            is_staff=True,
            is_superuser=True,
            **extra_fields
        )


class User(AbstractUser):
    username = models.CharField(max_length=30,
                                verbose_name="Username",
                                unique=True)
    USERNAME_FIELD = 'username'
    objects = UserManager()

    def __str__(self):
        return f'{self.id}'


class BaseModel(models.Model):
    """
    This model is used to change primary key with uuid
    to secure the data.
    """

    uuid = models.UUIDField(
        default=uuid.uuid4, primary_key=True, unique=True
    )
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        abstract = True


class Task(BaseModel):
    title = models.CharField(max_length=60)
    description = models.TextField(blank=True, null=True)
    due_date = models.DateTimeField()
    status = models.CharField(max_length=120)

    class Meta:
        verbose_name = ("Task")
        verbose_name_plural = ("Tasks")

    def __str__(self):
        return self.title

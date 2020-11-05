from django.db import models

class Email(models.Model):
    email_name = models.EmailField()
    schedule = models.JSONField()
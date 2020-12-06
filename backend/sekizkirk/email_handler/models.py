from django.db import models

class Person(models.Model):
    email = models.EmailField()

class Course(models.Model):
    course = models.CharField(max_length=7)

class Takes(models.Model):
    person = models.ForeignKey(Person, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    

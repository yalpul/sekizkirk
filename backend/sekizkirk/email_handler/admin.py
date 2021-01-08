from django.contrib import admin

from .models import Person, Course, Takes

# Register your models here.

admin.site.register(Person)
admin.site.register(Course)
admin.site.register(Takes)

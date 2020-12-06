import json

from django.http import HttpResponse

from .models import Person, Course, Takes


def index(request):
    if request.method == 'POST':
        data = json.loads(request.body)

        person = Person(data['email'])
        person.save()
        for course in data['courses']:
            takes = Takes(person, course)
            takes.save()


        # TODO: implement mail service here

        return HttpResponse() 

import json

from django.http import HttpResponse

from .models import Email


def index(request):
    if request.method == 'POST':
        data = json.loads(request.body)

        Email(**data).save()

        # TODO: implement mail service here

        return HttpResponse() 
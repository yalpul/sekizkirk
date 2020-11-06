from django.http import HttpResponse


def index(request):
    if request.method == 'POST':
        return HttpResponse() 
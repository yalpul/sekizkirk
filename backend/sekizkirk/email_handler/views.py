import json

from django.http import HttpResponse

from django.core.mail import send_mail

from .models import Person, Course, Takes


def index(request):
    try:
        if request.method == 'POST':
            data = json.loads(request.body)
            mail_addr = data['email']

            person = Person(email=mail_addr)
            person.save()
            for courseid in data['courses']:
                course = Course.objects.get(course=courseid)
                takes = Takes(person=person, course=course)
                takes.save()


            sendmail(mail_addr)

            return HttpResponse() 
    except:
        return HttpResponse(b'Error', status=404)

def sendmail(mail_addr):
    send_mail('Your schedule',
        'We\'ve received your schedule and we will notify you when your courses change',
        'support@sekizkirk.io',
        [mail_addr],
        fail_silently=False,
    )

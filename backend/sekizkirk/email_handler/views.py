import json

from django.http import HttpResponse

from django.core.mail import send_mail

from .models import Person, Course, Takes

from .data import jsondata


def index(request):
    try:
        if request.method == 'POST':
            data = json.loads(request.body)
            mail_addr = data['email']
            schedule = data['schedule']
            notify = data['notify']

            person, created = Person.objects.get_or_create(email=mail_addr)
            if created:
                person.save()
            for courseid in schedule:
                course, created = Course.objects.get_or_create(course=courseid)
                if created:
                    course.save()
                takes = Takes(person=person, course=course)
                takes.save()


            sendmail(mail_addr, schedule)

            return HttpResponse(status=200) 
    except:
        return HttpResponse(status=500) 

def sendmail(mail_addr, schedule):
    for course, section in schedule.items():
        print(course, section)
        slots = jsondata.get_slots()[course][section]
    send_mail('Your schedule',
        'We\'ve received your schedule and we will notify you when your courses change'+'\nHere is your schedule: ' + str(slots),
        'support@sekizkirk.io',
        [mail_addr],
        fail_silently=False,
    )

jsondata.init_scraper()
jsondata.update_data()

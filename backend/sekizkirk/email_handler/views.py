import json

import urllib.request as req

from django.http import HttpResponse

from django.core.mail import send_mail

from .models import Person, Course, Takes



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
        raise
        return HttpResponse(status=500) 

def get_slots(course, section):
    get_url = 'http://scraper:8001/q?' + course + '=' + str(section)
    response = req.urlopen(get_url).read().decode('utf-8')
    return json.loads(response)

def prepare_html(sched):
    post_url = 'http://renderer:3000/'
    slots_data = []
    for course, section in sched.items():
        slots = get_slots(course, section)
        slots_idx_form = [{'hourIndex':y,'dayIndex':x} for x,y in slots[0]]
        slots_data.append(
            {
                'name' : course+'/'+str(section),
                'slots' : slots_idx_form
            }
        )
    data = {'data' : slots_data}
    data_encoded = bytes(json.dumps(data), 'utf-8')
    response = req.urlopen(post_url, data_encoded)
    html = response.read().decode('utf-8')
    return html


def sendmail(mail_addr, schedule):
    html_email = prepare_html(schedule)
    send_mail('Your schedule',
        'Please enable content to see the schedule',
        'support@sekizkirk.io',
        [mail_addr],
        fail_silently=False,
        html_content=html_email
    )

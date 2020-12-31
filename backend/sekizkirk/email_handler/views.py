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

def get_course_info(course, section):
    get_url = 'http://scraper:8001/q?' + course + '=' + str(section)
    response = req.urlopen(get_url).read().decode('utf-8')
    return json.loads(response)

def prepare_html(sched):
    post_url = 'http://renderer:3000/'
    slots_data = []
    idx = 0
    for course, section in sched.items():
        real_section, slots, title = get_course_info(course, section)[0]
        for slot in slots:
            classroom = '' if len(slot) <= 2 else '\n'+slot[2]
            name = title+'/'+str(real_section)+classroom
            x,y = slot[:2]
            slots_data.append(
                {
                    'name' : name,
                    'slot' : {'hourIndex':y, 'dayIndex':x},
                    'courseIndex' : idx
                }
            )
        idx += 1
    data = {'data' : slots_data}
    data_encoded = bytes(json.dumps(data), 'utf-8')
    request = req.Request(post_url, headers={'Content-Type':'application/json'})
    response = req.urlopen(request, data_encoded)
    html_json = response.read().decode('utf-8')
    html = json.loads(html_json)
    return html['data']


def sendmail(mail_addr, schedule):
    html_email = prepare_html(schedule)
    send_mail('Your schedule',
        'Please enable content to see the schedule',
        'support@sekizkirk.io',
        [mail_addr],
        fail_silently=False,
        html_message=html_email
    )

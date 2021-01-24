import json

import urllib.request as req

from django.http import HttpResponse
from django.core.exceptions import ValidationError

from django.core.mail import send_mail

from .models import Person, Course, Takes
from .utils import form_validator
from .utils import notify_validator
from .utils import create_people_course_map

def unsubscribe(request, uuid):
    try:
        student = Person.objects.get(uuid=uuid)
        student.notify = False
        student.save()
        print(f'{uuid}({student.email}) unsubbed')
        return HttpResponse(f'You have successfully unsubscribed. We will no longer send notification mails to {student.email}.')
    except:
        return HttpResponse(status=404)    

    

def notify(request):
    if request.method != 'POST':
        return HttpResponse(status=405)
    if request.content_type != 'application/json':
        return HttpResponse(status=400)
    try:
        data = json.loads(request.body)
        changed_courses = notify_validator(data)
    except json.JSONDecodeError:
        return HttpResponse(status=400)
    except:
        return HttpResponse(status=400)

    try:
        # a map of student and a list of courses that he takes
        # and the courses are changed
        people_course_map = create_people_course_map(changed_courses)
        send_notify_mail(people_course_map)

    except:
        return HttpResponse(status=400)
        

def index(request):
    if request.method == "POST":
        if request.content_type != "application/json":
            return HttpResponse(status=400)

        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return HttpResponse(status=400)

        try:
            (mail_addr, schedule, notify) = form_validator(data)
        except ValidationError:
            return HttpResponse(status=400)
        except AssertionError:
            return HttpResponse(status=400)

        try:
            person, created = Person.objects.get_or_create(email=mail_addr)
            if created or person.notify != notify:
                person.notify = notify
                person.save()
            if not created:
                Takes.objects.filter(person=person).delete()

            for courseid in schedule:
                course, created = Course.objects.get_or_create(course=courseid)
                if created:
                    course.save()
                takes, created = Takes.objects.get_or_create(person=person, course=course)
                if created:
                    takes.save()

            sendmail(mail_addr, schedule)
        except:
            return HttpResponse(status=500)

        return HttpResponse(status=200)
    else:
        return HttpResponse(status=405)


def get_course_info(course_list):
    query = []
    for course, section in course_list:
        query.append(course + '=' + str(section))
    query = '&'.join(query)
    get_url = "http://scraper:8001/q?" + query
    response = req.urlopen(get_url).read().decode("utf-8")
    return json.loads(response)


def prepare_html(sched):
    post_url = "http://renderer:3000/"
    slots_data = []
    idx = 0
    course_info_list = get_course_info(sched.items())
    for real_section, slots, title in course_info_list:
        for slot in slots:
            classroom = "" if len(slot) <= 2 else "\n" + slot[2]
            name = title + "/" + str(real_section) + classroom
            x, y = slot[:2]
            slots_data.append(
                {
                    "name": name,
                    "slot": {"hourIndex": y, "dayIndex": x},
                    "courseIndex": idx,
                }
            )
        idx += 1
    data = {"data": slots_data}
    data_encoded = bytes(json.dumps(data), "utf-8")
    request = req.Request(post_url, headers={"Content-Type": "application/json"})
    response = req.urlopen(request, data_encoded)
    html_json = response.read().decode("utf-8")
    html = json.loads(html_json)
    return html["data"]


def sendmail(mail_addr, schedule):
    html_email = prepare_html(schedule)
    send_mail(
        "Your schedule",
        "Please enable content to see the schedule",
        None, # email address comes from settings.DEFAULT_FROM_EMAIL
        [mail_addr],
        fail_silently=False,
        html_message=html_email,
    )

def send_notify_mail(people_course_map):
    for student, courses in people_course_map.items():
        text = 'Your changed courses: ' + ','.join(courses) + \
            f'\nTo unsubscribe, Follow this link: https://sekizkirk.io/email/unsubscribe/{Person.objects.get(email=student).uuid}'
        send_Mail(
            'Course Change Notification',
            text,
            [student],
            fail_silently=False
        )


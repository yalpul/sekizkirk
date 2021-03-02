import os
import json

from django.core.validators import validate_email
from django.core.exceptions import ObjectDoesNotExist

from django.core.mail import send_mail

import urllib.request as req

from .models import Person, Course, Takes

def form_validator(data):
    """
    Raises exceptions if form data is not valid.
    If valid return, fields.
    """
    mail_addr = data["email"]
    schedule = data["schedule"]
    notify = data["notify"]

    # raises exception for caller if email is not valid
    validate_email(mail_addr)

    # notify should be boolean type
    assert type(notify) == bool

    # schedule should be dict
    assert type(schedule) == dict

    for key, val in schedule.items():
        assert type(key) == str
        assert len(key) == 7
        assert type(val) == int

        for ch in key:
            assert ch.isdigit() == True

    return (mail_addr, schedule, notify)

def notify_validator(data):
    try:
        if data['apiKey'] == os.environ['API_KEY']:
            return data['courseList']
        else:
            raise ValueError('invalid api key')
    except:
        raise

def create_people_course_map(changed_courses):
    student_map = {}
    for course in changed_courses.keys():
        try:
            course_id = Course.objects.get(course=course)
        except ObjectDoesNotExist:
            continue
        students = Takes.objects.filter(course=course_id)
        for entry in students:
            if entry.person.notify == False:
                continue
            student_email = entry.person.email
            if student_email in student_map:
                student_map[student_email].append(course)
            else:
                student_map[student_email] = [course]
    return student_map

def get_course_info(course_list):
    query = []
    for course, section in course_list:
        query.append(course + '=' + str(section))
    query = '&'.join(query)
    get_url = "http://scraper:8001/q?" + query
    response = req.urlopen(get_url).read().decode("utf-8")
    return json.loads(response)

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
        p = Person.objects.get(email=student)
        unsub = p.uuid
        html_email = prepare_notify_email(courses, unsub)
        send_mail(
            'Course Change Notification',
            "Please enable content to see the schedule",
            None, # email address comes from settings.DEFAULT_FROM_EMAIL
            [student],
            fail_silently=False,
            html_message=html_email
        )

def prepare_html(sched):
    post_url = "http://renderer:3000/table"
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

def prepare_notify_email(courses, unsub):
    post_url = "http://renderer:3000/notify"
    unsub_url = "https://sekizkirk.io/unsubscribe/"
    changed_courses = [
            {
                "courseName" : course[0],
                "reasons" : course[1:],
            } for course in courses]
    payload = {
        "changedCourses" : changed_courses,
        "unsubLink" : unsub_url + unsub
    }

    data_encoded = bytes(json.dumps(payload), 'utf-8')
    request = req.Request(post_url, headers={'Content-Type': 'application/json'})
    response = req.urlopen(request, data_encoded)
    html_json = response.read().decode('utf-8')
    html = json.loads(html_json)
    return html["data"]

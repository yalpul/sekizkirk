from django.core.validators import validate_email

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
        if data['apiKey'] == os.environ['APIKEY']:
            return data['courseList']
        else:
            raise ValueError('invalid api key')
    except:
        raise

def create_people_course_map(changed_courses):
    student_map = {}
    for course in changed_courses:
        course_id = Course.objects.get(course=course)
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


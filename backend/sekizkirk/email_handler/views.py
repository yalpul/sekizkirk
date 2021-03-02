import json

from django.http import HttpResponse
from django.core.exceptions import ValidationError


from .models import Person, Course, Takes
from .utils import form_validator
from .utils import notify_validator
from .utils import create_people_course_map
from .utils import sendmail
from .utils import send_notify_mail

def unsubscribe(request, uuid):
    try:
        student = Person.objects.get(uuid=uuid)
        student.notify = False
        student.save()
        print(f'{uuid}({student.email}) unsubbed')
        return HttpResponse(f'You have successfully unsubscribed. We will no longer send notification mails to {student.email}.')
    except Exception as e:
        print('Unsubscribe failed')
        print(repr(e))
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
        print('people - course map: ', people_course_map)
        send_notify_mail(people_course_map)
        print('Notify mail sent successfully.')
        return HttpResponse(status=200)

    except Exception as e:
        print('Notify mail send failed.')
        print(repr(e))
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
        except Exception as e:
            print('Send mail failed.')
            print(repr(e))
            return HttpResponse(status=500)

        return HttpResponse(status=200)
    else:
        return HttpResponse(status=405)


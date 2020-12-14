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


def make_ascii_table(schedule):
    table = [[''] * 5 for _ in range(10)]
    for course, section in schedule.items():
        section_no, slots, _, _ = jsondata.get_slots()[course][section]
        for slot in slots:
            day, hour = slot[:2]
            table[hour][day] = jsondata.get_courses()[course]['title'].split(' - ')[0] + '/' + str(section_no)

    table_str = '\n' + ' ' * 10 + '|  Monday   |  Tuesday  | Wednesday | Thursday  |  Friday   |'
    table_str += '\n' + '_' * 71 + '\n'
    table = [[f'{table[i][j]:>11}' for j in range(5)] for i in range(9)]
    for i in range(9):
        table_str +=  f'|{8+i:6}:40|'+'|'.join(table[i])+'|'
        table_str += '\n' + '_' * 71 + '\n'
    table_str += '\n'
    return table_str


def sendmail(mail_addr, schedule):
    sched = make_ascii_table(schedule)
    send_mail('Your schedule',
        'We\'ve received your schedule and we will notify you when your courses change'+'\nHere is your schedule: \n' + sched,
        'support@sekizkirk.io',
        [mail_addr],
        fail_silently=False,
    )

jsondata.init_scraper()
jsondata.update_data()

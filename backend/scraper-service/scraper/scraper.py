#! /usr/bin/python3

import os
import sys
import json
from .depts import depts
from .musts import musts
from .slots import slots

class scraper:
    def __init__(self, cache_path, silent=True):
        self.path = cache_path
        self.silent = silent
        self.musts = []
        self.dept_codes = []
        self.semester = None
        self.slots = []
        self.courses = []
        self.data = {}
        self.musts_path = os.path.join(self.path, 'musts.json')
        self.courses_path = os.path.join(self.path, 'courses.json')
        self.slots_path = os.path.join(self.path, 'course_slots.json')
        self.data_path = os.path.join(self.path, 'data.json')
        self.musts_scraper = None
        self.depts_scraper = None
        self.slots_scraper = None

    # scraper must be inited first. It initializes its underlying scrapers
    def init_scraper(self):
        if not os.path.exists(self.path):
            os.mkdir(self.path)

        self.musts_scraper = musts(
            cache_path = self.musts_path,
            silent = self.silent
        )

        self.depts_scraper = depts(
            cache_path = self.courses_path,
            silent = self.silent
        )

        self.semester = self.depts_scraper.get_current_semester()

        self.slots_scraper = slots(
            cache_path = self.slots_path,
            cookie_generator = self.depts_scraper.get_cookie(),
            silent = self.silent
        )
        
    # convert semester to string form ie `20201 -> fall`
    def get_semester(self):
        semester_num = self.semester[-1]
        if semester_num == '1':
            return 'fall'
        elif semester_num == '2':
            return 'spring'
        elif semester_num == '3':
            return 'summer'
        else:
            return None

    # run the scraper to get musts data
    def scrape_musts(self, force_update=True):
        self.musts_scraper.import_data(force_update=force_update)
        self.musts = self.musts_scraper.get_musts()

    # return the musts data
    def get_musts(self):
        if not self.musts:
            self.scrape_musts(force_update=False)
        return self.musts

    def get_dept_codes(self):
        if not self.dept_codes:
            self.dept_codes = depts.get_department_codes()
        return self.dept_codes

    # runs the scraper to get the courses data
    def scrape_courses(self, force_update=True):
        self.depts_scraper.import_data(force_update=force_update)
        self.courses = self.depts_scraper.get_courses()
        self.slots_scraper.set_course_codes(self.depts_scraper.get_codes())

    # returns the courses data
    def get_courses(self):
        if not self.courses:
            self.scrape_courses(force_update=False)
        return self.courses

    # runs the slots scraper and updates the slots values
    def scrape_slots(self, force_update=True):
        self.slots_scraper.import_data(force_update=force_update)
        self.slots = self.slots_scraper.get_slots()

    # returns the scraped slots data
    def get_slots(self):
        if not self.slots:
            self.scrape_slots(force_update=False)
        return self.slots
        
    # returns the timestamp in UTC-3 (Ankara) format
    def get_timestamp(self):
        from datetime import datetime, timezone, timedelta
        ankara_timezone = timezone(timedelta(hours=3))
        fmt = '%d-%m-%Y %H:%M'
        timestamp = datetime.now(tz=ankara_timezone).strftime(fmt)
        return timestamp

    # update the data. it includes all of the values, slots, musts, etc
    def update_data(self):
        self.data = {
            "musts" : self.get_musts(),
            "courses" : self.get_courses(),
            "departments" : self.get_dept_codes(),
            "courseSlots" : self.get_slots(),
            "lastUpdate" : self.get_timestamp(),
            "semester" : self.get_semester()
        }

        with open(self.data_path, 'w') as f:
            f.write(json.dumps(self.data))

    def get_data(self):
        if not self.data:
            self.update_data()
        return self.data

    def get_slots_of_course_section(self, course, section):
        '''
        expects a course id and a section index.
        returns: the actual section number, slots, course title
        section index is the index within the course slots list
        return the actual section, slots and course title
        '''
        try:
            sections = self.slots[course]
            sec = sections[section]
            course_title = self.courses[course]['title']
            title = course_title.split(' - ')[0]

            actual_section, slots = sec[0], sec[1]
            return actual_section, slots, title
        except:
            return None

    # compare two slots data and determine the changed courses
    def changed_courses(self, old, new):
        changed_courses = []
        for course in old.keys():
            if course not in new:
                changed_courses.append(course)
                continue
            old_slots = old[course]
            new_slots = new[course]
            if old_slots != new_slots:
                changed_courses.append(course)
        return changed_courses


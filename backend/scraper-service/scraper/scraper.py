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

        self.slots_scraper = slots(
            cache_path = self.slots_path,
            cookie = self.depts_scraper.get_cookie(),
            silent = self.silent
        )
        
    def scrape_musts(self, force_update=True):
        self.musts_scraper.import_data(force_update=force_update)
        self.musts = self.musts_scraper.get_musts()

    def get_musts(self):
        if not self.musts:
            self.scrape_musts(force_update=False)
        return self.musts

    def get_dept_codes(self):
        if not self.dept_codes:
            self.dept_codes = depts.get_department_codes()
        return self.dept_codes

    def scrape_courses(self, force_update=True):
        self.depts_scraper.import_data(force_update=force_update)
        self.courses = self.depts_scraper.get_courses()
        self.slots_scraper.set_course_codes(self.depts_scraper.get_codes())

    def get_courses(self):
        if not self.courses:
            self.scrape_courses(force_update=False)
        return self.courses

    def scrape_slots(self, force_update=True):
        self.slots_scraper.import_data(force_update=force_update)
        self.slots = self.slots_scraper.get_slots()

    def get_slots(self):
        if not self.slots:
            self.scrape_slots(force_update=False)
        return self.slots
        
    def get_timestamp(self):
        from datetime import datetime, timezone, timedelta
        ankara_timezone = timezone(timedelta(hours=3))
        fmt = '%d-%m-%Y %H:%M'
        timestamp = datetime.now(tz=ankara_timezone).strftime(fmt)
        return timestamp

    def update_data(self):
        self.data = {
            "musts" : self.get_musts(),
            "courses" : self.get_courses(),
            "departments" : self.get_dept_codes(),
            "courseSlots" : self.get_slots(),
            "lastUpdate" : self.get_timestamp()
        }

        with open(self.data_path, 'w') as f:
            f.write(json.dumps(self.data))

    def get_data(self):
        if not self.data:
            self.update_data()
        return self.data

    def get_slots_of_course_section(self, course, section):
        try:
            sections = self.slots[course]
            for sec in sections:
                if sec[0] == section:
                    return sec[1]
            return None
        except:
            return None


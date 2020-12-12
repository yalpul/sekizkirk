#! /usr/bin/python3

import os
import sys
import depts
import musts
import slots
import json

class scraper:
    def __init__(self, cache_path, silent=True):
        self.path = cache_path
        self.silent = silent
        self.musts = []
        self.dept_codes = []
        self.slots = []
        self.courses = []
        self.data = {}
        self.courses_path = os.path.join(self.path, 'courses.json')
        self.slots_path = os.path.join(self.path, 'course_slots.json')
        self.data_path = os.path.join(self.path, 'data.json')
        self.depts_scraper = None
        self.slots_scraper = None

    def init_scraper(self):
        if not os.path.exists(self.path):
            os.mkdir(self.path)

        self.depts_scraper = depts.depts(
            cache_path = self.courses_path,
            silent = self.silent
        )

        self.slots_scraper = slots.slots(
            cache_path = self.slots_path,
            cookie = self.depts_scraper.get_cookie(),
            silent = self.silent
        )
        
    def scrape_musts(self):
        self.musts = musts.get_all_musts(silent=self.silent)

    def get_musts(self):
        if not self.musts:
            self.scrape_musts()
        return self.musts

    def get_dept_codes(self):
        self.dept_codes = depts.depts.get_department_codes()

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

#!/usr/bin/python3

import os
import json
import urllib.request as req
from .dept_codes import dept_codes

class musts:
    def __init__(self, cache_path, silent=True):
        self.url = 'https://catalog.metu.edu.tr/program.php?fac_prog='
        self.silent = silent
        self.cache_path = cache_path
        self.semesters = [
            'First',
            'Second',
            'Third',
            'Fourth',
            'Fifth',
            'Sixth',
            'Seventh',
            'Eighth'
        ]

    # split rows of table (without the table header)
    def get_rows(self, html):
        rows = []
        idx = 0
        while True:
            idx = html.find('<tr', idx)
            if idx == -1: break
            idx2 = html.find('</tr>', idx)
            rows.append(html[idx+4:idx2])
            idx = idx2
        return rows[1:]

    def log(self, msg, progress=False):
        if not self.silent:
            print(msg, end='\r' if progress else '\n')

    # parse must and elective courses from table rows
    def get_courses(self, rows):
        must = []
        selectives = []
        selective = []
        elective = []
        current = must
        for row in rows:
            idx = row.find('course_code=')
            if idx > 0:
                current.append(row[idx+12:idx+19])
            elif row.find('Any 1 of the following set') != -1: continue
            elif row.count('td') == 1:
                current = selective if current is must else must
                if selective:
                    selectives.append(selective)
                    selective = []
            else:
                elect_i = row.find('ELECTIVE')
                s = row.rfind('>', 0, elect_i)
                elective.append(row[s+1:elect_i+8])
        return [must, selectives, elective]

    # get catalog data for a given department (all 8 semesters)
    def get_dept_musts(self, dept):
        html = req.urlopen(self.url+dept).read().decode('iso-8859-9')
        if html.find('Ooops something went wrong') != -1:
            return None
        musts = []
        for semester in self.semesters:
            sem_i = html.find(semester)
            table_begin = html.find('<table>', sem_i)+7
            table_end = html.find('</table>', table_begin)
            rows = self.get_rows(html[table_begin:table_end])
            musts.append(self.get_courses(rows))
        return musts

    # get all catalog data for all departments
    def get_all_musts(self):
        musts = {}
        i = 1
        lim = len(dept_codes)
        self.log('Collecting must courses...')
        for dept in dept_codes.keys():
            dept_musts = self.get_dept_musts(dept)
            self.log(f'{i:3}/{lim:3}', progress=True)
            if dept_musts:
                musts[dept] = dept_musts
            i += 1
        self.log('Must courses collected.')
        self.musts = musts

    def import_data(self, force_update=False):
        musts_path = self.cache_path
        if os.path.exists(musts_path) and not force_update:
            self.log('Must courses found. Importing...')
            with open(musts_path, 'r') as f:
                self.musts = json.loads(f.read())
        else:
            self.get_all_musts()
            with open(musts_path, 'w') as f:
                f.write(json.dumps(self.musts))

    # return musts data. data must be imported beforehand
    def get_musts(self):
        return self.musts

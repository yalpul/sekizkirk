import urllib.request as req
import urllib.parse as parse
import os
import json

from .dept_codes import dept_codes

class depts:
    def __init__(self, cache_path, silent=True):
        self.url = \
            'https://oibs2.metu.edu.tr/View_Program_Course_Details_64/main.php'

        self.dept_form = {'select_dept'       : '571',
                          'select_semester'   : None,
                          'submit_CourseList' : 'Submit',
                          'hidden_redir'      : 'Login'}

        self.silent = silent
        self.course_codes = []
        self.course_names = []
        self.courses = {}
        self.cache_path = cache_path
        self.dept_form['select_semester'] = self.scrape_semester()
        self.log(f"Semester: {self.dept_form['select_semester']}")

    def log(self, msg, progress=False):
        if not self.silent:
            print(msg, end='\r' if progress else '\n')

    def get_current_semester(self):
        return self.dept_form['select_semester']

    # Fall:1, Spring:2 ex. 20191, 20182 etc.
    def scrape_semester(self):
        html = req.urlopen(self.url).read().decode('utf-8', errors='ignore')
        semester_begin = html.find('select_semester')
        first_child_str = 'option value="'
        first_child_str_i = html.find(first_child_str, semester_begin)
        semester_str_end = html.find('"', first_child_str_i+len(first_child_str))
        semester = html[first_child_str_i+len(first_child_str):semester_str_end]
        return semester

    # Extract courses offered by the department given the department page
    def parse_courses(self, html):
        start_str = '<INPUT TYPE="radio" VALUE="'
        course_name_str = '<TD ALIGN="Center"><FONT FACE=ARIAL>'
        course_name_len = len(course_name_str)
        str_len = len(start_str)
        course_codes = []
        course_names = []
        idx2 = 0
        while True:
            idx = html.find(start_str, idx2)
            if idx == -1: break
            idx2 = html.find('"', idx+str_len)
            course_codes.append(html[idx+str_len:idx2])
            idx2 = html.find(course_name_str, idx2)
            course_name_idx = html.find(course_name_str, idx2+1)
            idx2 = html.find('</FONT>', course_name_idx)
            course_name = html[course_name_idx+course_name_len:idx2]
            course_names.append(course_name)
        self.course_codes += course_codes
        self.course_names += course_names

    # Get cookie for the PHP session
    def get_cookie(self):
        def cookie_getter():
            self.dept_form['select_dept'] = '571'
            encoded_form = parse.urlencode(self.dept_form)
            response = req.urlopen(self.url, bytes(encoded_form, 'ascii'))
            return response.getheader('Set-Cookie')
        return cookie_getter

    # Collect course data (code-name pairs) offered by all departments
    def collect_courses(self):
        self.log('Collecting course codes...')
        dept_not_found_str = \
            'Information about the department could not be found'
        i = 1
        for dept in dept_codes.keys():
            self.dept_form['select_dept'] = dept
            encoded = bytes(parse.urlencode(self.dept_form), 'ascii')
            dept_page = req.urlopen(self.url, encoded).read()
            dept_page = dept_page.decode('utf-8', errors='ignore')
            if dept_not_found_str not in dept_page:
                self.parse_courses(dept_page)
            self.log(f'{i:3}/{len(dept_codes):3}', progress=True)
            i += 1
        self.log('Course codes collected.')

    # prepare a data structure with merged course code and name
    def merge_course_data(self):
        self.courses = {}
        for code, name in zip(self.course_codes, self.course_names):
            dept_code = code[:3]
            dept_name = dept_codes[dept_code]
            course_code = code[4:] if code[3] == '0' else code[3:]
            self.courses[code] = {
                'title': dept_name + course_code + ' - ' + name.replace(' ()', ''),
                'code': code,
            }
        return self.courses

    # Try to read data from files if they exist. Otherwise get from oibs
    def import_data(self, force_update=False):
        courses_path = self.cache_path
        if os.path.exists(courses_path) and not force_update:
            self.log('Course codes found. Importing...')
            with open(courses_path, 'r') as f:
                self.courses = json.loads(f.read())
        else:
            self.collect_courses()
            self.courses = self.merge_course_data()
            with open(courses_path, 'w') as f:
                f.write(json.dumps(self.courses))

    # return course data. data must be imported beforehand
    def get_courses(self):
        return self.courses

    def get_codes(self):
        return self.courses.keys()

    @staticmethod
    def get_department_codes():
        departments = [{
            'code' : code,
            'title' : dept,
        } for code, dept in dept_codes.items()]
        return sorted(departments, key=lambda x:x['title'])

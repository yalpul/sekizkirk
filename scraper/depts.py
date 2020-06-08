import urllib.request as req
import urllib.parse as parse
import json

from dept_codes import dept_codes

class depts:
    def __init__(self, update_courses=False,\
                 silent=False, cache_dir='sekizkirk_cache/'):
        self.url = \
            'https://oibs2.metu.edu.tr/View_Program_Course_Details_64/main.php'

        self.dept_form = {'select_dept'       : '571',
                          'select_semester'   : None,
                          'submit_CourseList' : 'Submit',
                          'hidden_redir'      : 'Login'}

        self.silent = silent
        self.course_codes = []
        self.course_names = []
        self.cache_dir = cache_dir
        self.dept_form['select_semester'] = self.get_current_semester()
        self.log(f"Semester: {self.dept_form['select_semester']}")
        try:
            self.import_data(update_courses)
        except KeyboardInterrupt:
            print('\nAbort.')

    def log(self, msg, progress=False):
        if not self.silent:
            print(msg, end='\r' if progress else '\n')

    # Fall:1, Spring:2 ex. 20191, 20182 etc.
    def get_current_semester(self):
        import time
        year, month = time.localtime(time.time())[:2]
        if month <= 6:
            return str(year-1)+'2'
        else:
            return str(year)+'1'

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
        self.dept_form['select_dept'] = '571'
        encoded_form = parse.urlencode(self.dept_form)
        response = req.urlopen(self.url, bytes(encoded_form, 'ascii'))
        return response.getheader('Set-Cookie')

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

    # Try to read data from files if they exist. Otherwise get from oibs
    def import_data(self, force_update):
        import os
        names_path = self.cache_dir + 'course_names.json'
        codes_path = self.cache_dir + 'course_codes.json'
        if os.path.exists(names_path) and os.path.exists(codes_path)\
            and not force_update:
            self.log('Course codes found. Importing...')
            with open(names_path, 'r') as f:
                self.course_names = eval(f.read())
            with open(codes_path, 'r') as f:
                self.course_codes = eval(f.read())
        else:
            self.collect_courses()
            with open(names_path, 'w') as f:
                f.write(json.dumps(self.course_names))
            with open(codes_path, 'w') as f:
                f.write(json.dumps(self.course_codes))

    def get_codes(self):
        return self.course_codes

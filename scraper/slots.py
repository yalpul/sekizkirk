import urllib.request as req
import urllib.parse as parse
import sys
import json

from dept_codes import dept_codes

class slots:
    def __init__(self, course_codes, cookie, update_slots=False,\
                 silent=False, cache_dir='sekizkirk_cache/'):
        self.url = \
            'https://oibs2.metu.edu.tr/View_Program_Course_Details_64/main.php'

        self.course_form = {'text_course_code' : None,
                            'SubmitCourseInfo' : 'Course Info',
                            'hidden_redir'     : 'Course_List'}

        self.constraint_form = {'submit_section' : None,
                                'hidden_redir'     : 'Course_Info'}
        self.silent = silent
        self.cache_dir = cache_dir
        self.course_codes = course_codes
        self.course_slots = {}
        self.cookie = cookie
        try:
            self.import_data(update_slots)
        except KeyboardInterrupt:
            print('\nAbort.')
            sys.exit()

    # Convert day-hour format to indexed format
    # ['Monday', '8:40', '10:30', <classroom>] to
    # [0, 0, <classroom>], [0, 1, <classroom>]
    def to_standard_form(self, record):
        def convert_day(day):
            day_table = {
                'Monday'    : 0,
                'Tuesday'   : 1,
                'Wednesday' : 2,
                'Thursday'  : 3,
                'Friday'    : 4,
                'Saturday'  : 5,
                'Sunday'    : 6
            }
            return day_table[day]
        slots = []
        start, end = record[1], record[2]
        start = int(start[:start.find(':')])
        end = int(end[:end.find(':')])
        if len(record) == 4:
            for i in range(start, end):
                slots.append([convert_day(record[0]), i-8, record[3]])
        elif len(record) == 3:
            for i in range(start, end):
                slots.append([convert_day(record[0]), i-8])
        else:
            print(record)
        return slots
            
    def log(self, msg, progress=False):
        if not self.silent:
            print(msg, end='\r' if progress else '\n')

    # Parse timeslots from the course page
    def get_timeslots(self, html):
        start_str = '<FONT FACE=ARIAL>'
        end_str = '</FONT>'
        str_len = len(start_str)
        section = 1
        section_str = lambda x : '<INPUT TYPE="submit" VALUE="'+str(x)+'"'
        slots = []
        idx = 0
        while True:
            idx = html.find(section_str(section), idx)
            if idx == -1: break
            constraints_html = self.get_constraints_html(section)
            constraints = self.parse_constraints(constraints_html)
            standard_constraints = self.normalize_constraints(constraints)
            idx = html.find('<TABLE>', idx)
            time_slots= []
            for i in range(5):
                record = []
                for j in range(4):
                    idx = html.find(start_str, idx)
                    idx2 = html.find(end_str, idx+str_len)
                    token = html[idx+str_len:idx2]
                    if token: record.append(token)
                    idx = idx2
                if len(record) > 1:
                    time_slots += self.to_standard_form(record)
            slots.append([time_slots, standard_constraints])
            section += 1
        return slots

    # Convert constraint data to a standard form
    def normalize_constraints(self, constraints):
        return [c[:3] for c in constraints if \
            c[3] == '0.00' and c[4] == '4.00' and \
            c[1] != c[2]]

    # Parse the constraints page
    def parse_constraints(self, html):
        if 'There is no section criteria' in html:
            return []
        table_begin = html.find('Given Dept')
        table_end = html.find('</TABLE>', table_begin)
        table = html[table_begin:table_end]
        idx = table.find('</TR>')
        constraints = []
        while True:
            idx = table.find('<TR>', idx)
            if idx == -1: break
            tokens = []
            for i in range(9):
                token = table.find('ARIAL>', idx)
                end_token = table.find('</', token)
                tokens.append(table[token+6:end_token])
                idx = end_token
            constraints.append(tokens)
        return constraints

    # Get name/surname/dept constraints for the given section
    def get_constraints_html(self, section):
        request = req.Request(self.url, headers={'Cookie':self.cookie})
        self.constraint_form['submit_section'] = section
        encoded_form = bytes(parse.urlencode(self.constraint_form), 'ascii')
        constraint_data = req.urlopen(request, encoded_form).read()
        return constraint_data.decode('utf-8')

    # Get course page for the given course code
    def request_course(self, course):
        request = req.Request(self.url, headers={'Cookie':self.cookie})
        self.course_form['text_course_code'] = course
        encoded_form = bytes(parse.urlencode(self.course_form), 'ascii')
        course_data = req.urlopen(request, encoded_form).read()
        return course_data.decode('utf-8', errors='ignore')
        # errors='ignore' needed because of dumbass oibs developers

    # Collect course timeslot data of internal course list using oibs
    def collect_course_slots(self):
        self.log('Collecting course slots...')
        course_slots = {}
        i = 1
        for course in self.course_codes:
            course_page = self.request_course(course)
            slots = self.get_timeslots(course_page)
            course_slots[course] = slots
            self.log(f'{i:4}/{len(self.course_codes):4}', progress=True)
            i += 1
        self.course_slots = course_slots
        self.log('Course slots collected.')

    # Try to read data from files if they exist. Otherwise get from oibs
    def import_data(self, force_update):
        import os
        slots_path = os.path.join(self.cache_dir, 'course_slots.json')
        if os.path.exists(slots_path) and not force_update:
            self.log('Slots found. Importing...')
            with open(slots_path, 'r') as f:
                self.course_slots = eval(f.read())
        else:
            self.collect_course_slots()
            with open(slots_path, 'w') as f:
                f.write(json.dumps(self.course_slots))

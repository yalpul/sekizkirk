#! /usr/bin/python3

import os
import sys
import json
import time
import threading
from scraper.scraper import scraper
from argparse import ArgumentParser, ArgumentTypeError
import urllib.request as req

def notify_course_takers(courses):
    url = 'http://web:8000/notify/'
    courses_serial = bytes(json.dumps(courses), 'ascii')
    response = req.urlopen(url, courses_serial)
    

def handle_reqs(sc):
    from http.server import BaseHTTPRequestHandler, HTTPServer
    class handler(BaseHTTPRequestHandler):
        def do_GET(self):
            try:
                queries = self.path.split('q?')[1]
                result = []
                for query in queries.split('&'):
                    course, section = query.split('=')
                    section = int(section)
                    slots = sc.get_slots_of_course_section(course, section)
                    result.append(slots)
                result_json = bytes(json.dumps(result), 'utf-8')
            except:
                result_json = b'{}'
            finally:
                if result_json == b'{}':
                    self.send_response(404)
                else:
                    self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(result_json)
            

    h = HTTPServer(('0.0.0.0', 8001), handler)
    try:
        h.serve_forever()
    except:
        h.server_close()


def parse_arguments():
    def time_period(period):
        '''
            Time period is accepted as a number and a time unit, 7d, 2w, 12h etc.
            Converts to hours and returns that value
        '''
        unit = period[-1]
        value = int(period[:-1])
        if period.isdigit():
            raise ArgumentTypeError('The unit of the time period must be given')

        if unit == 'h':
            return value
        elif unit == 'd':
            return value*24
        elif unit == 'w':
            return value*24*7
        else:
            raise ArgumentTypeError(f'{unit} must be one of \'h\', \'d\', \'w\'')
        
    parser = ArgumentParser()
    parser.add_argument('--path', help='Relative path to save data', \
        default='sekizkirk_cache/')
    parser.add_argument('--silent', action='store_true',\
        help='Do not write anything to stdout')
    parser.add_argument('--period', help='Time period for data scraper, expects a unit next to the number, one of \'h\', \'d\', \'w\'. default=1w',
        default=7*24, type=time_period)
    return parser.parse_args()

def sekizkirk_scrape(period : 'hour', path='sekizkirk_cache', silent=False):
    period_sec = period * 60 * 60
    data_path = os.path.join(os.getcwd(), path)
    if not os.path.exists(data_path):
        os.mkdir(data_path)
    sc = scraper(cache_path=data_path, silent=silent)
    sc.init_scraper()

    departments = sc.get_dept_codes()

    with open(os.path.join(data_path, 'departments.json'), 'w') as f:
        f.write(json.dumps(departments))

    sc.update_data()

    req_handler_thread = threading.Thread(target=handle_reqs, args=(sc,), daemon=True)
    req_handler_thread.start()


    while True:
        time.sleep(period_sec)
        old_slots = sc.get_slots()
        sc.scrape_slots()
        sc.update_data()
        new_slots = sc.get_slots()
        changed_courses = sc.changed_courses(old_slots, new_slots)
        if changed_courses:
            notify_course_takers(changed_courses)


if __name__ == '__main__':
    args = parse_arguments()

    try:
        scraper_thread = threading.Thread(target=sekizkirk_scrape,
            args=(args.period, args.path, args.silent), daemon=True)
        scraper_thread.start()
        scraper_thread.join()
    except KeyboardInterrupt:
        print('\nAbort.')
        sys.exit()


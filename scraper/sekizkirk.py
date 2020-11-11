#! /usr/bin/python3

import os
import sys
import depts
import musts
import slots
import json
from argparse import ArgumentParser


def parse_arguments():
    parser = ArgumentParser()
    parser.add_argument('--path', help='Relative path to save data', \
        default='sekizkirk_cache/')
    parser.add_argument('--silent', action='store_true',\
        help='Do not write anything to stdout')
    parser.add_argument('--update-courses', action='store_true',\
        help='Force an update on course data')
    parser.add_argument('--update-slots', action='store_true',\
        help='Force an update on slots data')
    parser.add_argument('--musts', action='store_true',\
        help='Update must courses')
    parser.add_argument('--departments', action='store_true',\
        help='Update department codes')
    return parser.parse_args()

if __name__ == '__main__':
    args = parse_arguments()

    data_path = os.path.join(os.getcwd(), args.path)
    if not os.path.exists(data_path):
        os.mkdir(data_path)

    if args.musts:
        must_data = musts.get_all_musts(args.silent)
        with open(os.path.join(data_path, 'musts.json'), 'w') as f:
            f.write(json.dumps(must_data))

    if args.departments:
        departments = depts.depts.get_department_codes()
        with open(os.path.join(data_path, 'departments.json'), 'w') as f:
            f.write(json.dumps(departments))


    dp = depts.depts(update_courses = args.update_courses,\
                     silent = args.silent,\
                     cache_dir = data_path)

    ts = slots.slots(dp.get_codes(), dp.get_cookie(),\
                     update_slots = args.update_slots,\
                     silent = args.silent,\
                     cache_dir = data_path) 

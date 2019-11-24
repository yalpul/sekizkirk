#! /usr/bin/python3

import os
import sys
import depts
import musts
import slots
from argparse import ArgumentParser

cache_dir = 'sekizkirk_cache/'

def parse_arguments():
    parser = ArgumentParser()
    parser.add_argument('--silent', action='store_true',\
        help='Do not write anything to stdout')
    parser.add_argument('--update-courses', action='store_true',\
        help='Force an update on course data')
    parser.add_argument('--update-slots', action='store_true',\
        help='Force an update on slots data')
    parser.add_argument('--musts', action='store_true',\
        help='Update only must courses')
    return parser.parse_args()

if __name__ == '__main__':
    args = parse_arguments()

    if not os.path.exists(cache_dir):
        os.mkdir(cache_dir)

    if args.musts:
        must_data = musts.get_all_musts()
        with open(cache_dir+'musts', 'w') as f:
            f.write(repr(must_data))
        sys.exit()

    dp = depts.depts(update_courses = args.update_courses,\
                     silent = args.silent,\
                     cache_dir = cache_dir)

    ts = slots.slots(dp.get_codes(), dp.get_cookie(),\
                     update_slots = args.update_slots,\
                     silent = args.silent,\
                     cache_dir = cache_dir)

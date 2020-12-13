#! /usr/bin/python3

import os
import sys
import json
from scraper.scraper import scraper
from argparse import ArgumentParser


def parse_arguments():
    parser = ArgumentParser()
    parser.add_argument('--path', help='Relative path to save data', \
        default='sekizkirk_cache/')
    parser.add_argument('--silent', action='store_true',\
        help='Do not write anything to stdout')
    return parser.parse_args()

def sekizkirk_scrape(path='sekizkirk_cache', silent=False):
    data_path = os.path.join(os.getcwd(), path)
    if not os.path.exists(data_path):
        os.mkdir(data_path)
    sc = scraper(cache_path=data_path, silent=silent)
    sc.init_scraper()

    departments = sc.get_dept_codes()

    with open(os.path.join(data_path, 'departments.json'), 'w') as f:
        f.write(json.dumps(departments))

    try:
        sc.update_data()
    except KeyboardInterrupt:
        print('\nAbort.')
        sys.exit()

if __name__ == '__main__':
    args = parse_arguments()

    sekizkirk_scrape(
        path=args.path,
        silent=args.silent,
    )


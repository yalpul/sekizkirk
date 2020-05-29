#!/usr/bin/python3

import urllib.request as req
from dept_codes import dept_codes

url = 'https://catalog.metu.edu.tr/program.php?fac_prog='
semesters = ['First', 'Second', 'Third', 'Fourth', 'Fifth',\
             'Sixth', 'Seventh', 'Eighth']

# split rows of table (without the table header)
def get_rows(html):
    rows = []
    idx = 0
    while True:
        idx = html.find('<tr', idx)
        if idx == -1: break
        idx2 = html.find('</tr>', idx)
        rows.append(html[idx+4:idx2])
        idx = idx2
    return rows[1:]

# parse must and elective courses from table rows
def get_courses(rows):
    must = []
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
        else:
            elect_i = row.find('ELECTIVE')
            s = row.rfind('>', 0, elect_i)
            elective.append(row[s+1:elect_i+8])
    return [must, selective, elective]

# get catalog data for a given department (all 8 semesters)
def get_dept_musts(dept):
    html = req.urlopen(url+dept).read().decode('iso-8859-9')
    if html.find('Ooops something went wrong') != -1:
        return None
    musts = []
    for semester in semesters:
        sem_i = html.find(semester)
        table_begin = html.find('<table>', sem_i)+7
        table_end = html.find('</table>', table_begin)
        rows = get_rows(html[table_begin:table_end])
        musts.append(get_courses(rows))
    return musts

# get all catalog data for all departments
def get_all_musts():
    musts = {}
    for dept in dept_codes.keys():
        dept_musts = get_dept_musts(dept)
        if dept_musts:
            musts[dept] = dept_musts
    return musts

if __name__ == '__main__':
    musts = get_all_musts()
    with open('musts', 'w') as f:
        f.write(repr(musts))

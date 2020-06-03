import React from 'react';
import { render } from 'react-dom';

import courseCodes from '../data/course_codes.json';
import courseNames from '../data/course_names.json';
import courseSlots from '../data/course_slots.json';
import musts from '../data/musts.json';

import App from './App';

render(
  <App
    courseCodes={courseCodes}
    courseNames={courseNames}
    courseSlots={courseSlots}
    musts={musts}
  />,
  document.getElementById('root')
);

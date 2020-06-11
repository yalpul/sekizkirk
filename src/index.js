import React from 'react';
import { render } from 'react-dom';

import courseCodes from '../data/course_codes.json';
import courseNames from '../data/course_names.json';
import courseSlots from '../data/course_slots.json';
import musts from '../data/musts.json';

import App from './App';
import DataContext from './components/DataContext';

const data = {
    courseCodes,
    courseNames,
    courseSlots,
    musts,
};

render(
    <React.StrictMode>
        <DataContext.Provider value={data}>
            <App />
        </DataContext.Provider>
    </React.StrictMode>,
    document.getElementById('root')
);

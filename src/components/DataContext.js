import React, { createContext } from "react";

import courseSlots from "../../data/course_slots.json";
import musts from "../../data/musts.json";
import departments from "../../data/departments.json";
import courses from "../../data/courses.json";

const data = {
    musts,
    courses,
    departments,
    courseSlots: courseSlots.data,
    lastUpdate: courseSlots.tstamp,
};

export const DataContext = createContext({});

export const DataProvider = ({ children }) => {
    return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
};

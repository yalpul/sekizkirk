import React from "react";
import { render } from "react-dom";

import courseSlots from "../data/course_slots.json";
import musts from "../data/musts.json";
import departments from "../data/departments.json";
import courses from "../data/courses.json";

import App from "./App";
import DataContext from "./components/DataContext";

const data = {
    musts,
    courses,
    departments,
    courseSlots: courseSlots.data,
    lastUpdate: courseSlots.tstamp,
};

render(
    <React.StrictMode>
        <DataContext.Provider value={data}>
            <App />
        </DataContext.Provider>
    </React.StrictMode>,
    document.getElementById("root")
);

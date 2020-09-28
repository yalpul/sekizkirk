import React from "react";
import { render } from "react-dom";

import courseCodes from "../data/course_codes.json";
import courseNames from "../data/course_names.json";
import courseSlots from "../data/course_slots.json";
import deptCodes from "../data/dept_codes.json";
import musts from "../data/musts.json";

import App from "./App";
import DataContext from "./components/DataContext";

// append coursecodes to course names as object
// NOTE: this feature can be moved to backend logic.
const courses = courseNames.map((course, index) => {
    const code = courseCodes[index];
    // get departmant code, its the first 3 numbers in courseCodes
    const deptCode = code.substr(0, 3);
    const deptName = deptCodes[deptCode];

    // get course code, last 4 digits, mostly first digit is 0, discard it
    let courseCode = code.substr(3, 4);
    courseCode =
        Number(courseCode[0]) === 0 ? courseCode.substr(1, 3) : courseCode;

    // some course names finishes with the `()`, just empty paranthesis
    // remove them
    const nameModified = course.replace(" ()", "");

    return { title: `${deptName}${courseCode} - ${nameModified}`, code };
});

const departments = Object.entries(deptCodes).map(([code, title]) => ({
    code,
    title,
}));

const data = {
    // courseCodes,
    // courseNames,
    // courseSlots,
    // deptCodes,
    // musts,
    courses,
    departments,
};

render(
    <React.StrictMode>
        <DataContext.Provider value={data}>
            <App />
        </DataContext.Provider>
    </React.StrictMode>,
    document.getElementById("root")
);

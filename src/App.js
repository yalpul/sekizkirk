import React, { useEffect, useState, useContext } from "react";

import { DataContext } from "./components/DataContext";
import { CoursesProvider } from "./components/CoursesContext";

import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/core";

import LandingPage from "./components/LandingPage";
import Form from "./components/Form";
import theme from "./components/Theme";
import ScheduleTable from "./components/ScheduleTable";

const App = () => {
    const data = useContext(DataContext);

    const [courses, setCourses] = useState([]);
    const [sectionChecks, setSectionChecks] = useState({});
    const [allowCollision, setAllowCollision] = useState({});

    const [tableDisplay, setTableDisplay] = useState("none");
    const [dept, setDept] = useState(null);

    const [fixedSections, setFixedSections] = useState({});

    useEffect(() => {
        // initialize sections for newly added courses
        courses.forEach((course) => {
            const sections = data.courseSlots[course.code];

            if (sectionChecks[course.code] === undefined) {
                setSectionChecks((prevChecks) => ({
                    ...prevChecks,
                    [course.code]: sections.map(() => true),
                }));
            }
        });

        // initialize allow collision for newly added courses
        courses.forEach((course) => {
            if (allowCollision[course.code] === undefined) {
                setAllowCollision((prevCollision) => ({
                    ...prevCollision,
                    [course.code]: false,
                }));
            }
        });
    }, [courses]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <main>
                <LandingPage />
                <CoursesProvider>
                    <Form
                        courses={courses}
                        setCourses={setCourses}
                        display={tableDisplay}
                        setDisplay={setTableDisplay}
                        dept={dept}
                        setDept={setDept}
                        sectionChecks={sectionChecks}
                        setSectionChecks={setSectionChecks}
                        allowCollision={allowCollision}
                        setAllowCollision={setAllowCollision}
                        fixedSections={fixedSections}
                    />
                    <ScheduleTable
                        courses={courses}
                        display={tableDisplay}
                        mustDept={dept}
                        sectionChecks={sectionChecks}
                        setSectionChecks={setSectionChecks}
                        allowCollision={allowCollision}
                        fixedSections={fixedSections}
                        setFixedSections={setFixedSections}
                    />
                </CoursesProvider>
            </main>
        </ThemeProvider>
    );
};

export default App;

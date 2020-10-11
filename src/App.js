import React, { useState } from "react";

import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/core";

import LandingPage from "./components/LandingPage";
import Form from "./components/Form";
import theme from "./components/Theme";
import ScheduleTable from "./components/ScheduleTable";

const App = () => {
    const [courses, setCourses] = useState([]);
    const [tableDisplay, setTableDisplay] = useState("flex");
    const [dept, setDept] = useState(null);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <main>
                <LandingPage />
                <Form
                    courses={courses}
                    setCourses={setCourses}
                    display={tableDisplay}
                    setDisplay={setTableDisplay}
                    dept={dept}
                    setDept={setDept}
                />
                <ScheduleTable
                    courses={courses}
                    display={tableDisplay}
                    mustDept={dept}
                />
            </main>
        </ThemeProvider>
    );
};

export default App;

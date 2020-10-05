import React, { useState } from "react";

import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/core";

import LandingPage from "./components/LandingPage";
import Form from "./components/Form";
import theme from "./components/Theme";
import ScheduleTable from "./components/ScheduleTable";

const App = () => {
    const [courses, setCourses] = useState([]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <main>
                <LandingPage />
                <Form courses={courses} setCourses={setCourses} />
                <ScheduleTable />
            </main>
        </ThemeProvider>
    );
};

export default App;

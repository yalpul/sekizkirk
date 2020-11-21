import React, { useState } from "react";

import { DataProvider } from "./components/DataContext";
import { CoursesProvider } from "./components/CoursesContext";

import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/core";

import LandingPage from "./components/LandingPage";
import Form from "./components/Form";
import theme from "./components/Theme";
import ScheduleTable from "./components/ScheduleTable";

const App = () => {
    const [tableDisplay, setTableDisplay] = useState("none");

    console.log("app rendered.");
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <main>
                <LandingPage />
                <DataProvider>
                    <CoursesProvider>
                        <Form
                            tableDisplay={tableDisplay}
                            setTableDisplay={setTableDisplay}
                        />
                        <ScheduleTable tableDisplay={tableDisplay} />
                    </CoursesProvider>
                </DataProvider>
            </main>
        </ThemeProvider>
    );
};

export default App;

import React, { useState } from "react";

import { DataProvider } from "./components/DataContext";
import { CoursesProvider } from "./components/CoursesContext";
import { DisplayProvider } from "./components/DisplayContext";

import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/core";

import LandingPage from "./components/LandingPage";
import Form from "./components/Form/Form";
import theme from "./components/Theme";
import ScheduleTable from "./components/ScheduleTable";

const App = () => {
    const [tableDisplay, setTableDisplay] = useState("none");
    const [openDialog, setOpenDialog] = useState(null);

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
                            openDialog={openDialog}
                            setOpenDialog={setOpenDialog}
                        />
                        <DisplayProvider>
                            <ScheduleTable
                                tableDisplay={tableDisplay}
                                openDialog={openDialog}
                            />
                        </DisplayProvider>
                    </CoursesProvider>
                </DataProvider>
            </main>
        </ThemeProvider>
    );
};

export default App;

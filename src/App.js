import React, { useState } from "react";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/core";

import LandingPage from "./components/LandingPage";
import Form from "./components/Form/Form";
import theme from "./components/Theme";
import ScheduleTable from "./components/ScheduleTable";
import Footer from "./components/Footer";
import About from "./components/About";
import { DataProvider } from "./components/DataContext";
import { CoursesProvider } from "./components/CoursesContext";
import { DisplayProvider } from "./components/DisplayContext";

const App = () => {
    const [tableDisplay, setTableDisplay] = useState("none");
    const [openDialog, setOpenDialog] = useState(null);
    const [dept, setDept] = useState(null);

    console.log("app rendered.");
    return (
        <Router>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Switch>
                    <Route path="/about">
                        <About />
                    </Route>
                    <Route path="/">
                        <main>
                            <LandingPage />
                            <DataProvider>
                                <CoursesProvider>
                                    <Form
                                        tableDisplay={tableDisplay}
                                        setTableDisplay={setTableDisplay}
                                        openDialog={openDialog}
                                        setOpenDialog={setOpenDialog}
                                        dept={dept}
                                        setDept={setDept}
                                    />
                                    <DisplayProvider>
                                        <ScheduleTable
                                            tableDisplay={tableDisplay}
                                            openDialog={openDialog}
                                            mustDept={dept}
                                        />
                                    </DisplayProvider>
                                </CoursesProvider>
                                <Footer display={tableDisplay} />
                            </DataProvider>
                        </main>
                    </Route>
                </Switch>
            </ThemeProvider>
        </Router>
    );
};

export default App;

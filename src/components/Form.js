import React, { useState, useEffect, useContext } from "react";

import AddCourse from "./AddCourse";
import AddMusts from "./AddMusts";
import CoursesList from "./CoursesList";
import SelectiveList from "./SelectiveList";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import SchoolIcon from "@material-ui/icons/School";

const useStyles = makeStyles((theme) => ({
    mainContainer: {
        minHeight: "100vh",
        backgroundColor: theme.palette.common.sekizkirkGrey,
        paddingBottom: "5em",
    },
    headingContainer: {
        [theme.breakpoints.down("xs")]: {
            marginTop: "2em",
        },
        marginTop: "5em",
        marginBottom: "3em",
        textAlign: "center",
    },
    heading: {
        [theme.breakpoints.down("xs")]: {
            fontSize: "2.5em",
        },
    },
    buttonContainer: {
        marginTop: "3em",
    },
    scheduleButton: {
        "&:hover": {
            backgroundColor: theme.palette.primary.light,
        },
        color: "white",
        fontFamily: "Agrandir",
        fontWeight: 400,
        backgroundColor: theme.palette.primary.dark,
        borderRadius: "50px",
    },
}));

const Form = ({ display, setDisplay, fixedSections }) => {
    const classes = useStyles();

    // const handleScheduleClick = () => {
    //     if (display !== "flex") {
    //         setDisplay("flex");
    //     }

    //     if (display === "flex") {
    //         // if the table shown in the UI, clicking `shedule button`
    //         // will focus `schedule-table` element.
    //         document.getElementById("schedule-table").scrollIntoView();
    //     }
    // };

    // useEffect(() => {
    //     document.getElementById("schedule-table").scrollIntoView();
    // }, [display]);

    // useEffect(() => {
    //     // deduplicate manually added courses and must courses
    //     const uniqCourses = [...new Set([...mustCourses, ...manualCourses])];
    //     setCourses(uniqCourses);
    // }, [mustCourses, manualCourses]);

    // useEffect(() => {
    //     if (courses.length === 0) {
    //         setSelectiveCourses([]);
    //     }
    // }, [courses]);

    console.log("Form rendered.");
    return (
        <Grid
            container
            direction="column"
            className={classes.mainContainer}
            id="form-container"
            alignItems="center"
        >
            <Grid item className={classes.headingContainer}>
                <Typography variant="h2" className={classes.heading}>
                    Select Your Courses
                </Typography>
            </Grid>

            <AddCourse />

            <AddMusts />

            <CoursesList />

            <SelectiveList />

            {/* <Grid item className={classes.buttonContainer}>
                {courses.length > 0 && (
                    <Button
                        variant="contained"
                        // color="primary"
                        disableRipple
                        className={classes.scheduleButton}
                        endIcon={<SchoolIcon />}
                        onClick={handleScheduleClick}
                    >
                        schedule
                    </Button>
                )}
            </Grid> */}
        </Grid>
    );
};

export default Form;

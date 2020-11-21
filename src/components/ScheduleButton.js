import React, { useEffect, useContext } from "react";

import { CoursesContext } from "./CoursesContext";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import SchoolIcon from "@material-ui/icons/School";

const useStyles = makeStyles((theme) => ({
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

const ScheduleButton = ({ tableDisplay, setTableDisplay }) => {
    const classes = useStyles();
    const {
        coursesState: { manualCourses, mustCourses },
    } = useContext(CoursesContext);

    useEffect(() => {
        document.getElementById("schedule-table").scrollIntoView();
    }, [tableDisplay]);

    const handleScheduleClick = () => {
        if (tableDisplay !== "flex") {
            setTableDisplay("flex");
        }

        if (tableDisplay === "flex") {
            // if the table shown in the UI, clicking `shedule button`
            // will focus `schedule-table` element.
            document.getElementById("schedule-table").scrollIntoView();
        }
    };

    return (
        <Grid item className={classes.buttonContainer}>
            {/* show the schedule button only if there is available courses. */}
            {(manualCourses.length > 0 || mustCourses.length > 0) && (
                <Button
                    variant="contained"
                    disableRipple
                    className={classes.scheduleButton}
                    endIcon={<SchoolIcon />}
                    onClick={handleScheduleClick}
                >
                    schedule
                </Button>
            )}
        </Grid>
    );
};

export default ScheduleButton;

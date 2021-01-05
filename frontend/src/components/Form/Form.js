import React, { useState } from "react";

import AddCourse from "./AddCourse";
import AddMusts from "./AddMusts";
import CoursesList from "./CoursesList";
import SelectiveList from "./SelectiveList";
import ScheduleButton from "./ScheduleButton";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

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
}));

const Form = ({
    tableDisplay,
    setTableDisplay,
    openDialog,
    setOpenDialog,
    dept,
    setDept,
}) => {
    const classes = useStyles();
    const [course, setCourse] = useState(null);

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

            <AddCourse course={course} setCourse={setCourse} />

            <AddMusts dept={dept} setDept={setDept} />

            <CoursesList
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
                course={course}
            />

            <SelectiveList />

            <ScheduleButton
                tableDisplay={tableDisplay}
                setTableDisplay={setTableDisplay}
            />
        </Grid>
    );
};

export default Form;

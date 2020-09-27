import React, { useState, useContext } from "react";
import DataContext from "./DataContext";
import { makeStyles, useTheme } from "@material-ui/core/styles";

import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Typography from "@material-ui/core/Typography";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";

const useStyles = makeStyles((theme) => ({
    mainContainer: {
        minHeight: "100vh",
        backgroundColor: theme.palette.common.sekizkirkGrey,
    },
    heading: {
        marginTop: "5em",
        marginBottom: "3em",
        textAlign: "center",
    },
    courseSelect: {
        width: 500,
    },
    addButton: {
        marginLeft: "1em",
    },
}));

const Form = () => {
    const data = useContext(DataContext);
    const classes = useStyles();

    const [courseInput, setCourseInput] = useState("");
    const [courseValue, setCourseValue] = useState(null);
    const [courses, setCourses] = useState([]);

    const handleCourseAdd = () => {
        if (courseValue !== null && !courses.includes(courseValue)) {
            setCourses(courses.concat(courseValue));
        }
    };

    return (
        <Grid
            container
            direction="column"
            className={classes.mainContainer}
            id="form-container"
            alignItems="center"
        >
            <Grid item className={classes.heading}>
                <Typography variant="h2">Select Your Courses</Typography>
            </Grid>
            <Grid item container direction="row" justify="center">
                <Grid item className={classes.courseSelect}>
                    <Autocomplete
                        options={data.courses}
                        open={courseInput.length > 2}
                        popupIcon={<></>} // no icon
                        onInputChange={(event, value) => setCourseInput(value)}
                        onClose={(event, reason) => setCourseInput("")} // prevent popup options
                        onChange={(event, value) => setCourseValue(value)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Course Name"
                                variant="outlined"
                            />
                        )}
                        fullWidth
                        clearOnEscape
                        autoSelect
                        blurOnSelect
                        autoHighlight
                        noOptionsText="Course not found."
                    />
                </Grid>
                <Grid item>
                    <Fab
                        color="primary"
                        aria-label="add"
                        className={classes.addButton}
                        onClick={handleCourseAdd}
                    >
                        <AddIcon />
                    </Fab>
                </Grid>
            </Grid>
            <Grid item container direction="column" alignItems="center">
                {courses.map((course) => (
                    <Grid item key={course} style={{ marginBottom: "2px" }}>
                        <p>{course}</p>
                    </Grid>
                ))}
            </Grid>
        </Grid>
    );
};

export default Form;

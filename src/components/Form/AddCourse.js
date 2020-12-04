import React, { useState, useContext } from "react";

import { DataContext } from "../DataContext";
import { CoursesContext, ADD_COURSE } from "../CoursesContext";

import { makeStyles } from "@material-ui/core/styles";

import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import Grid from "@material-ui/core/Grid";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles((theme) => ({
    courseSelect: {
        [theme.breakpoints.up("sm")]: {
            width: "35em",
        },
        [theme.breakpoints.down("xs")]: {
            width: "25em",
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
            // pushes the add button a little bit
            marginBottom: theme.spacing(3),
        },
    },
    addButton: {
        marginLeft: "1em",
        "&:hover": {
            backgroundColor: theme.palette.primary.light,
        },
    },
}));

const AddCourse = () => {
    const data = useContext(DataContext);
    const { dispatch } = useContext(CoursesContext);
    const classes = useStyles();

    const [courseInput, setCourseInput] = useState("");
    const [course, setCourse] = useState(null);

    const handleCourseAdd = () => {
        dispatch({ type: ADD_COURSE, payload: { course } });
    };

    const options = React.useMemo(() => {
        return Object.values(data.courses);
    }, [data]);

    return (
        <Grid item container direction="row" justify="center">
            <Grid item>
                <Autocomplete
                    options={options}
                    getOptionLabel={(course) => course.title}
                    open={courseInput.length > 2}
                    popupIcon={<></>} // no icon
                    onInputChange={(event, value) => setCourseInput(value)}
                    onClose={() => setCourseInput("")} // prevent popup options
                    onChange={(event, value) => setCourse(value)}
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
                    className={classes.courseSelect}
                    id="course-select"
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
    );
};

export default AddCourse;

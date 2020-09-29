import React, { useState, useEffect, useContext } from "react";
import DataContext from "./DataContext";
import { makeStyles, useTheme } from "@material-ui/core/styles";

import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Typography from "@material-ui/core/Typography";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";

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
        width: "35em",
    },
    addButton: {
        marginLeft: "1em",
    },
    accordionContainer: {
        marginTop: "2em",
    },
    accordion: {
        backgroundColor: "inherit",
        width: "35em",
        border: `1px solid ${theme.palette.common.black}`,
    },
    accordionSummary: {
        "& .MuiAccordionSummary-content": {
            alignItems: "center",
            flexGrow: 0,
        },
    },
    mustSelect: {
        minWidth: "200px",
    },
}));

const Form = () => {
    const data = useContext(DataContext);
    const classes = useStyles();

    const [courseInput, setCourseInput] = useState("");
    const [courseValue, setCourseValue] = useState(null);
    const [dept, setDept] = useState(null);
    const [semester, setSemester] = useState("");
    const [manualCourses, setManualCourses] = useState([]);
    const [mustCourses, setMustCourses] = useState([]);
    const [courses, setCourses] = useState([]);

    const handleCourseAdd = () => {
        if (courseValue !== null && !courses.includes(courseValue)) {
            setManualCourses(manualCourses.concat(courseValue));
        }
    };

    const handleDepartmentChange = (event, value) => {
        setDept(value);
    };

    const handleSemesterChange = (event) => {
        setSemester(event.target.value);
    };

    // set the must courses when user select different
    // dept or semester options
    useEffect(() => {
        if (dept !== null && semester !== "") {
            // see musts data to understand its structure
            const mustCodes = data.musts[dept.code][semester - 1][0];

            setMustCourses(mustCodes.map((code) => data.courses[code]));
        } else {
            setMustCourses([]);
        }
    }, [dept, semester]);

    useEffect(() => {
        // deduplicate manually added courses and must courses
        const uniqCourses = [...new Set([...mustCourses, ...manualCourses])];
        setCourses(uniqCourses);
    }, [mustCourses, manualCourses]);

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
                <Grid item>
                    <Autocomplete
                        options={Object.values(data.courses)} // NOTE: put this computation out of component?
                        getOptionLabel={(course) => course.title}
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
                        className={classes.courseSelect}
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
            <Grid item className={classes.accordionContainer}>
                <Accordion className={classes.accordion}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        className={classes.accordionSummary}
                    >
                        <Typography variant="body1">
                            Add Must Courses
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid
                            container
                            justify="space-around"
                            alignItems="center"
                        >
                            <Grid item>
                                <Autocomplete
                                    options={data.departments}
                                    getOptionLabel={(department) =>
                                        department.title
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Department"
                                            variant="outlined"
                                        />
                                    )}
                                    onChange={handleDepartmentChange}
                                    popupIcon={<></>} // no icon
                                    fullWidth
                                    clearOnEscape
                                    autoSelect
                                    blurOnSelect
                                    autoHighlight
                                    noOptionsText="Not found."
                                    className={classes.mustSelect}
                                />
                            </Grid>
                            <Grid item>
                                <FormControl
                                    variant="outlined"
                                    className={classes.mustSelect}
                                >
                                    <InputLabel id="semester-select">
                                        Semester
                                    </InputLabel>
                                    <Select
                                        labelId="semester-select"
                                        value={semester}
                                        onChange={handleSemesterChange}
                                        label="semester"
                                    >
                                        {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                                            <MenuItem key={sem} value={sem}>
                                                {sem}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </AccordionDetails>
                </Accordion>
            </Grid>
            <Grid item container direction="column" alignItems="center">
                {courses.length > 0 && (
                    <Grid item style={{ marginTop: "25px" }}>
                        <Typography variant="h3">To be Scheduled</Typography>
                    </Grid>
                )}
                {courses.map((course) => {
                    return course !== undefined ? (
                        <Grid
                            item
                            key={course.code}
                            style={{
                                marginBottom: "2px",
                                background: mustCourses.includes(course)
                                    ? "yellow"
                                    : "red",
                            }}
                        >
                            <p>{course.title}</p>
                        </Grid>
                    ) : null;
                })}
            </Grid>
        </Grid>
    );
};

export default Form;

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
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import ClearAllIcon from "@material-ui/icons/ClearAll";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import AddCircleIcon from "@material-ui/icons/AddCircle";

const useStyles = makeStyles((theme) => ({
    mainContainer: {
        minHeight: "100vh",
        backgroundColor: theme.palette.common.sekizkirkGrey,
        paddingBottom: "5em",
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
    courseListContainer: {
        width: "100%",
        maxWidth: "35em",
        marginTop: "2em",
        backgroundColor: "#d4d4d4",
    },
    coursesHeader: {
        paddingLeft: theme.spacing(2),
    },
    selectiveContainer: {
        width: "100%",
        maxWidth: "35em",
        marginTop: "1em",
        backgroundColor: "#d4d4d4",
    },
    selectiveHeader: {
        fontWeight: 700,
        fontFamily: "Agrandir",
        paddingLeft: theme.spacing(2),
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
    },
    listItem: {
        "&:hover .list-icon": {
            color: theme.palette.primary.dark,
        },
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
    const [selectiveCourses, setSelectiveCourses] = useState([]);
    const [electiveCourses, setElectiveCourses] = useState([]);
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

    const handleClearAll = () => {
        setManualCourses([]);
        // setMustCourses([]);
        // setSelectiveCourses([]);
        // setting semester to unselected, deletes all must courses
        setSemester("");
    };

    const handleDeleteCourse = (course) => {
        // remember, course might be included in both of the arrays
        const newMust = mustCourses.filter((item) => item !== course);
        setMustCourses(newMust);

        const newManual = manualCourses.filter((item) => item !== course);
        setManualCourses(newManual);
    };

    const handleSelectiveClick = (course) => {
        setMustCourses([...mustCourses].concat(course));
        setSelectiveCourses([]);
    };

    const handleElectiveClick = (index) => {
        document.getElementById("course-select").focus();

        const tempElectives = [...electiveCourses];
        tempElectives.splice(index, 1);
        setElectiveCourses(tempElectives);
    };

    // set the must courses when user select different
    // dept or semester options
    useEffect(() => {
        if (dept !== null && semester !== "") {
            // see musts data to understand its structure

            const mustCodes = data.musts[dept.code][semester - 1][0];
            setMustCourses(mustCodes.map((code) => data.courses[code]));

            const selectiveCodes = data.musts[dept.code][semester - 1][1];
            setSelectiveCourses(
                selectiveCodes.map((code) => data.courses[code])
            );

            const electives = data.musts[dept.code][semester - 1][2];
            setElectiveCourses(electives);
        } else {
            setMustCourses([]);
            setSelectiveCourses([]);
            setElectiveCourses([]);
        }
    }, [dept, semester]);

    useEffect(() => {
        // deduplicate manually added courses and must courses
        const uniqCourses = [...new Set([...mustCourses, ...manualCourses])];
        setCourses(uniqCourses);
    }, [mustCourses, manualCourses]);

    useEffect(() => {
        if (courses.length === 0) {
            setSelectiveCourses([]);
        }
    }, [courses]);

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
            <Grid item className={classes.courseListContainer}>
                {courses.length > 0 && (
                    <>
                        <Grid
                            container
                            className={classes.coursesHeader}
                            alignItems="center"
                            justify="space-between"
                        >
                            <Typography variant="h6">
                                To be scheduled..
                            </Typography>
                            <Button
                                variant="contained"
                                color="secondary"
                                endIcon={<ClearAllIcon />}
                                size="small"
                                style={{ marginRight: "1em" }}
                                onClick={handleClearAll}
                            >
                                Clear
                            </Button>
                        </Grid>
                        <Divider />
                        <List>
                            {courses.map((course) => {
                                return course ? (
                                    <ListItem
                                        key={`${course.title}+${course.code}`}
                                        button
                                    >
                                        <ListItemText primary={course.title} />
                                        <ListItemSecondaryAction>
                                            <IconButton
                                                edge="end"
                                                onClick={() =>
                                                    handleDeleteCourse(course)
                                                }
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                ) : null;
                            })}
                            {electiveCourses.map((type, index) => (
                                <ListItem
                                    key={`${type}+${index}`}
                                    button
                                    justify="space-between"
                                    className={classes.listItem}
                                    onClick={(index) =>
                                        handleElectiveClick(index)
                                    }
                                >
                                    <ListItemText
                                        primary={`Add your ${type}`}
                                    />
                                    <ListItemIcon
                                        style={{ paddingLeft: "2.5em" }}
                                    >
                                        <AddCircleIcon className="list-icon" />
                                    </ListItemIcon>
                                </ListItem>
                            ))}
                        </List>
                    </>
                )}
            </Grid>
            <Grid item className={classes.selectiveContainer}>
                {selectiveCourses.length > 0 && (
                    <>
                        <Typography
                            variant="subtitle1"
                            className={classes.selectiveHeader}
                            color="secondary"
                        >
                            Selectives for this semester
                        </Typography>
                        <Divider />
                        <List dense>
                            {selectiveCourses.map((course) => {
                                return course ? (
                                    <ListItem
                                        key={`${course.title}+${course.code}`}
                                        button
                                        onClick={() =>
                                            handleSelectiveClick(course)
                                        }
                                        className={classes.listItem}
                                    >
                                        <ListItemIcon>
                                            <CheckCircleIcon className="list-icon" />
                                        </ListItemIcon>
                                        <ListItemText primary={course.title} />
                                    </ListItem>
                                ) : null;
                            })}
                        </List>
                    </>
                )}
            </Grid>
        </Grid>
    );
};

export default Form;

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
import ListSubheader from "@material-ui/core/ListSubheader";
import SchoolIcon from "@material-ui/icons/School";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";

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
    accordionContainer: {
        marginTop: "2em",
    },
    accordion: {
        backgroundColor: "inherit",
        border: `1px solid ${theme.palette.common.black}`,
        [theme.breakpoints.up("sm")]: {
            width: "35em",
        },
        [theme.breakpoints.down("xs")]: {
            width: "20em",
        },
    },
    accordionSummary: {
        "& .MuiAccordionSummary-content": {
            alignItems: "center",
            flexGrow: 0,
        },
    },
    deptSelect: {
        [theme.breakpoints.down("xs")]: {
            marginBottom: theme.spacing(2),
        },
    },
    mustSelect: {
        minWidth: "200px",
    },
    courseListContainer: {
        width: "100%",
        maxWidth: "35em",
        marginTop: "2em",
        backgroundColor: theme.palette.common.listBackground,
    },
    coursesHeader: {
        paddingLeft: theme.spacing(2),
    },
    selectiveContainer: {
        width: "100%",
        maxWidth: "35em",
        marginTop: "1em",
        backgroundColor: theme.palette.common.listBackground,
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

const Form = ({
    courses,
    setCourses,
    display,
    setDisplay,
    dept,
    setDept,
    sectionChecks,
    setSectionChecks,
}) => {
    const data = useContext(DataContext);
    const classes = useStyles();

    const [courseInput, setCourseInput] = useState("");
    const [courseValue, setCourseValue] = useState(null);
    const [semester, setSemester] = useState("");
    const [manualCourses, setManualCourses] = useState([]);
    const [mustCourses, setMustCourses] = useState([]);
    const [selectiveCourses, setSelectiveCourses] = useState([]);
    const [electiveCourses, setElectiveCourses] = useState([]);
    const [openDialog, setOpenDialog] = useState(null);

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

        // setting semester to unselected, deletes all must courses
        setSemester("");

        setSectionChecks({});
    };

    const handleDeleteCourse = (course) => {
        // remember, course might be included in both of the arrays
        const newMust = mustCourses.filter((item) => item !== course);
        setMustCourses(newMust);

        const newManual = manualCourses.filter((item) => item !== course);
        setManualCourses(newManual);

        setSectionChecks({...sectionChecks, [course.code]: undefined}) 
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

    const handleScheduleClick = () => {
        setDisplay("flex");

        if (display === "flex") {
            document.getElementById("schedule-table").scrollIntoView();
        }
    };

    useEffect(() => {
        document.getElementById("schedule-table").scrollIntoView();
    }, [display]);

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
            <Grid item className={classes.headingContainer}>
                <Typography variant="h2" className={classes.heading}>
                    Select Your Courses
                </Typography>
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
                            <Grid item className={classes.deptSelect}>
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
                                        <ListSubheader
                                            style={{ fontWeight: 700 }}
                                        >
                                            Fall
                                        </ListSubheader>
                                        {[1, 3, 5, 7].map((sem) => (
                                            <MenuItem key={sem} value={sem}>
                                                {sem}
                                            </MenuItem>
                                        ))}
                                        <ListSubheader
                                            style={{ fontWeight: 700 }}
                                        >
                                            Spring
                                        </ListSubheader>
                                        {[2, 4, 6, 8].map((sem) => (
                                            <MenuItem
                                                key={sem}
                                                value={sem}
                                                disabled
                                            >
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
                            {courses.map((course, index) => {
                                return course ? (
                                    <ListItem
                                        key={`${course.title}+${course.code}`}
                                        button
                                        onClick={() => setOpenDialog(index)}
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
            <Grid item className={classes.buttonContainer}>
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
            </Grid>

            {/* modals for course options */}
            {courses.map((course, index) => {
                return (
                    <Dialog
                        open={index === openDialog}
                        onClose={() => setOpenDialog(null)}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                        key={`${course}+${index}`}
                    >
                        <DialogTitle disableTypography>
                            <Typography
                                variant="h6"
                                style={{ lineHeight: 1.6, fontSize: "1em" }}
                            >
                                {`${course.title} OPTIONS`}
                            </Typography>
                        </DialogTitle>
                        <DialogContent>
                            <FormControl component="fieldset">
                                <FormLabel component="legend">
                                    Sections
                                </FormLabel>
                                <FormGroup aria-label="position" row>
                                    {sectionChecks[course.code] &&
                                        sectionChecks[
                                            course.code
                                        ].map((checked, index) => (
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        color="primary"
                                                        checked={checked}
                                                        onChange={() => {
                                                          const temp = sectionChecks[course.code];
                                                          temp[index] = !temp[index]
                                                          setSectionChecks({...sectionChecks, [course.code]: temp})
                                                        }}
                                                    />
                                                }
                                                label={index + 1}
                                                key={`${checked}+${index}`}
                                            />
                                        ))}
                                </FormGroup>
                            </FormControl>
                        </DialogContent>
                    </Dialog>
                );
            })}
        </Grid>
    );
};

export default Form;

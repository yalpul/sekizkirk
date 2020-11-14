import React, { useState, useEffect, useContext } from "react";

import DataContext from "./DataContext";
import AddCourse from "./AddCourse";
import AddMusts from "./AddMusts";
import CoursesList from "./CoursesList";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import SchoolIcon from "@material-ui/icons/School";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import Tooltip from "@material-ui/core/Tooltip";
import HelpIcon from "@material-ui/icons/Help";

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
    allowCollision,
    setAllowCollision,
    fixedSections,
}) => {
    console.log("Form rendered.");
    const data = useContext(DataContext);
    const classes = useStyles();

    const slotsData = data.courseSlots;

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

    const handleSelectiveClick = (course) => {
        setMustCourses([...mustCourses].concat(course));
        setSelectiveCourses([]);
    };

    const handleScheduleClick = () => {
        setDisplay("flex");

        if (display === "flex") {
            document.getElementById("schedule-table").scrollIntoView();
        }
    };

    const handleUnselectAll = (course) => {
        setSectionChecks({
            ...sectionChecks,
            [course.code]: sectionChecks[course.code].map(() => false),
        });
    };

    const handleCheck = (course, index) => {
        const temp = sectionChecks[course.code];
        temp[index] = !temp[index];
        setSectionChecks({
            ...sectionChecks,
            [course.code]: temp,
        });
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

            <AddCourse
                setCourseValue={setCourseValue}
                handleCourseAdd={handleCourseAdd}
            />

            <AddMusts
                setDept={setDept}
                setSemester={setSemester}
                semester={semester}
            />

            <CoursesList
                courses={courses}
                setManualCourses={setManualCourses}
                setSemester={setSemester}
                setSectionChecks={setSectionChecks}
                setAllowCollision={setAllowCollision}
                mustCourses={mustCourses}
                setMustCourses={setMustCourses}
                manualCourses={manualCourses}
                sectionChecks={sectionChecks}
                allowCollision={allowCollision}
                electiveCourses={electiveCourses}
                setElectiveCourses={setElectiveCourses}
                setOpenDialog={setOpenDialog}
            />

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
                                {`${course.title}`}
                            </Typography>
                        </DialogTitle>
                        <DialogContent>
                            <Grid container direction="column">
                                <Grid item>
                                    <FormControl component="fieldset">
                                        <FormLabel
                                            component="legend"
                                            focused={false}
                                        >
                                            Course Options
                                        </FormLabel>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    color="primary"
                                                    checked={
                                                        allowCollision[
                                                            course.code
                                                        ]
                                                    }
                                                    onChange={() =>
                                                        setAllowCollision(
                                                            (
                                                                prevCollision
                                                            ) => ({
                                                                ...prevCollision,
                                                                [course.code]: !prevCollision[
                                                                    course.code
                                                                ],
                                                            })
                                                        )
                                                    }
                                                />
                                            }
                                            label="Allow Collision"
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item style={{ marginTop: "1em" }}>
                                    <FormControl component="fieldset">
                                        <FormLabel
                                            component="legend"
                                            focused={false}
                                        >
                                            <Grid container alignItems="center">
                                                <Grid item>
                                                    <Typography>
                                                        Course Sections
                                                    </Typography>
                                                </Grid>
                                                <Grid
                                                    item
                                                    style={{
                                                        marginLeft: "0.5em",
                                                        marginRight: "0.5em",
                                                    }}
                                                >
                                                    <Button
                                                        variant="outlined"
                                                        size="small"
                                                        color="secondary"
                                                        onClick={() =>
                                                            handleUnselectAll(
                                                                course
                                                            )
                                                        }
                                                        disabled={
                                                            fixedSections[
                                                                course.code
                                                            ]
                                                        }
                                                    >
                                                        Unselect All
                                                    </Button>
                                                </Grid>
                                                <Grid item>
                                                    {fixedSections[
                                                        course.code
                                                    ] && (
                                                        <Tooltip
                                                            arrow
                                                            title="Unfix section in the table to enable selection."
                                                        >
                                                            <HelpIcon color="primary" />
                                                        </Tooltip>
                                                    )}
                                                </Grid>
                                            </Grid>
                                        </FormLabel>
                                        <FormGroup aria-label="position" row>
                                            {sectionChecks[course.code] &&
                                                sectionChecks[course.code].map(
                                                    (checked, index) => {
                                                        const [
                                                            sectionName,
                                                        ] = slotsData[
                                                            course.code
                                                        ][index];

                                                        return (
                                                            <FormControlLabel
                                                                control={
                                                                    <Checkbox
                                                                        color="primary"
                                                                        checked={
                                                                            checked
                                                                        }
                                                                        onChange={() =>
                                                                            handleCheck(
                                                                                course,
                                                                                index
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            fixedSections[
                                                                                course
                                                                                    .code
                                                                            ]
                                                                        }
                                                                    />
                                                                }
                                                                label={
                                                                    sectionName
                                                                }
                                                                key={`${checked}+${index}`}
                                                            />
                                                        );
                                                    }
                                                )}
                                        </FormGroup>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                onClick={() => setOpenDialog(null)}
                                color="secondary"
                            >
                                ok
                            </Button>
                        </DialogActions>
                    </Dialog>
                );
            })}
        </Grid>
    );
};

export default Form;

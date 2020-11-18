import React, { useState, useEffect, useContext } from "react";

import { DataContext } from "./DataContext";
import { CoursesContext, COURSE_ADD } from "./CoursesContext";

import AddCourse from "./AddCourse";
import AddMusts from "./AddMusts";
import CoursesList from "./CoursesList";
import SelectiveList from "./SelectiveList";
import SectionOptions from "./SectionOptions";

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
    const data = useContext(DataContext);
    const { dispatch } = useContext(CoursesContext);

    const classes = useStyles();

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
        dispatch({ type: COURSE_ADD, payload: { courseValue } });
    };

    const handleScheduleClick = () => {
        setDisplay("flex");

        if (display === "flex") {
            document.getElementById("schedule-table").scrollIntoView();
        }
    };

    useEffect(() => {
        if (display === "flex") {
            document.getElementById("schedule-table").scrollIntoView();
        }
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

            <SelectiveList
                selectiveCourses={selectiveCourses}
                setMustCourses={setMustCourses}
                mustCourses={mustCourses}
                setSelectiveCourses={setSelectiveCourses}
            />

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
            {courses.map((course, index) => (
                <SectionOptions
                    sectionChecks={sectionChecks}
                    setSectionChecks={setSectionChecks}
                    index={index}
                    course={course}
                    openDialog={openDialog}
                    setOpenDialog={setOpenDialog}
                    allowCollision={allowCollision}
                    setAllowCollision={setAllowCollision}
                    fixedSections={fixedSections}
                    key={`${course}+${index}`}
                />
            ))}
        </Grid>
    );
};

export default Form;

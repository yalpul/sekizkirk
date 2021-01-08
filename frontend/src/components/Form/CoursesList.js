import React, { useState, useEffect, useContext } from "react";

import {
    CoursesContext,
    DELETE_COURSE,
    DELETE_ALL,
    ELECTIVE_SELECT,
} from "../CoursesContext";
import SectionOptions from "./SectionOptions";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import ClearAllIcon from "@material-ui/icons/ClearAll";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";

const useStyles = makeStyles((theme) => ({
    courseListContainer: {
        width: "100%",
        maxWidth: "35em",
        marginTop: "2em",
        backgroundColor: theme.palette.common.listBackground,
    },
    coursesHeader: {
        paddingLeft: theme.spacing(2),
    },
    listItem: {
        "&:hover .list-icon": {
            color: theme.palette.primary.dark,
        },
    },
    glowingItem: {
        borderRadius: "10px",
        boxShadow: `0 0 20px ${theme.palette.primary.main}`,
    },
}));

const CoursesList = ({
    openDialog,
    setOpenDialog,
    course,
    setDept,
    setSemester,
}) => {
    const classes = useStyles();
    const { coursesState, dispatch } = useContext(CoursesContext);
    const { uniqueCourses, electiveCourses } = coursesState;

    const [coursesMouseOver, setCoursesMouseOver] = useState(null);
    const [electivesMouseOver, setElectivesMouseOver] = useState(null);
    const [electiveClicked, setElectiveClicked] = useState(null);
    const [courseSelectFocused, setCourseSelectFocused] = useState(false);

    const handleClearAll = () => {
        dispatch({ type: DELETE_ALL });

        // clear must inputs
        setDept(null);
        setSemester("");
    };

    const handleDeleteCourse = (course) => {
        dispatch({ type: DELETE_COURSE, payload: { course } });
    };

    const handleElectiveClick = (index) => {
        document.getElementById("course-select").focus();
        setElectiveClicked(index);
    };

    const handleElectiveDelete = (index) => {
        dispatch({ type: ELECTIVE_SELECT, payload: { index } });
    };

    useEffect(() => {
        if (openDialog === null) {
            setCoursesMouseOver(null);
        }
    }, [openDialog]);

    useEffect(() => {
        document
            .getElementById("course-select")
            .addEventListener("blur", () => {
                setCourseSelectFocused(false);
            });

        document
            .getElementById("course-select")
            .addEventListener("focus", () => {
                setCourseSelectFocused(true);
            });
    }, []);

    useEffect(() => {
        // remove gloving effect on elective courses when
        // focus removed from course select and no courses selected
        if (
            courseSelectFocused === false &&
            course === null &&
            electiveClicked !== null
        ) {
            setElectiveClicked(null);
        }
    }, [courseSelectFocused, course]);

    useEffect(() => {
        // if unique courses changed while elective clicked,
        // it means a course added for elective
        if (electiveClicked !== null) {
            handleElectiveDelete(electiveClicked);
        }
    }, [uniqueCourses]);

    return (
        <Grid item className={classes.courseListContainer}>
            {(uniqueCourses.length > 0 || electiveCourses.length > 0) && (
                <>
                    <Grid
                        container
                        className={classes.coursesHeader}
                        alignItems="center"
                        justify="space-between"
                    >
                        <Grid item>
                            <Typography variant="h6">
                                To be scheduled..
                            </Typography>
                        </Grid>

                        <Grid item>
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
                    </Grid>
                    <Divider />
                    <List>
                        {uniqueCourses.map((course, index) => {
                            return course ? (
                                <ListItem
                                    key={`${course.title}+${course.code}`}
                                    button
                                    onClick={() => setOpenDialog(index)}
                                    ContainerProps={{
                                        onMouseOver: () =>
                                            setCoursesMouseOver(index),
                                        onFocus: () =>
                                            setCoursesMouseOver(index),
                                        onMouseOut: () =>
                                            setCoursesMouseOver(null),
                                        onBlur: () => setCoursesMouseOver(null),
                                    }}
                                >
                                    <ListItemText primary={course.title} />
                                    <ListItemSecondaryAction
                                        style={{
                                            display:
                                                coursesMouseOver === index
                                                    ? undefined
                                                    : "none",
                                        }}
                                    >
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
                                className={`${classes.listItem} ${
                                    index === electiveClicked
                                        ? classes.glowingItem
                                        : undefined
                                }`}
                                onClick={() => handleElectiveClick(index)}
                                ContainerProps={{
                                    onMouseOver: () =>
                                        setElectivesMouseOver(index),
                                    onFocus: () => setElectivesMouseOver(index),
                                    onMouseOut: () =>
                                        setElectivesMouseOver(null),
                                    onBlur: () => setElectivesMouseOver(null),
                                }}
                            >
                                <ListItemText primary={`Add your ${type}`} />
                                <ListItemSecondaryAction
                                    style={{
                                        display:
                                            electivesMouseOver === index
                                                ? undefined
                                                : "none",
                                    }}
                                >
                                    <IconButton
                                        edge="end"
                                        onClick={handleElectiveDelete}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                    </List>
                </>
            )}

            {/* modals for course options */}
            {uniqueCourses.map((course, index) => {
                return (
                    <SectionOptions
                        index={index}
                        course={course}
                        openDialog={openDialog}
                        setOpenDialog={setOpenDialog}
                        setMouse={setCoursesMouseOver}
                        key={course.code}
                    />
                );
            })}
        </Grid>
    );
};

export default CoursesList;

import React, { useContext, useState } from "react";

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
import ListItemIcon from "@material-ui/core/ListItemIcon";
import AddCircleIcon from "@material-ui/icons/AddCircle";

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
}));

const CoursesList = () => {
    const classes = useStyles();
    const { coursesState, dispatch } = useContext(CoursesContext);
    const { mustCourses, manualCourses, electiveCourses } = coursesState;

    const [openDialog, setOpenDialog] = useState(null);

    // find unique courses, same courses might be added manuelly as well as
    // included in the musts.
    const courses = [...new Set([...mustCourses, ...manualCourses])];

    const handleClearAll = () => {
        dispatch({ type: DELETE_ALL });
    };

    const handleDeleteCourse = (course) => {
        dispatch({ type: DELETE_COURSE, payload: { course } });
    };

    const handleElectiveClick = (index) => {
        document.getElementById("course-select").focus();
        dispatch({ type: ELECTIVE_SELECT, payload: { index } });
    };

    return (
        <Grid item className={classes.courseListContainer}>
            {(courses.length > 0 || electiveCourses.length > 0) && (
                <>
                    <Grid
                        container
                        className={classes.coursesHeader}
                        alignItems="center"
                        justify="space-between"
                    >
                        <Typography variant="h6">To be scheduled..</Typography>
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
                                onClick={() => handleElectiveClick(index)}
                            >
                                <ListItemText primary={`Add your ${type}`} />
                                <ListItemIcon style={{ paddingLeft: "2.5em" }}>
                                    <AddCircleIcon className="list-icon" />
                                </ListItemIcon>
                            </ListItem>
                        ))}
                    </List>
                </>
            )}

            {/* modals for course options */}
            {courses.map((course, index) => (
                <SectionOptions
                    index={index}
                    course={course}
                    openDialog={openDialog}
                    setOpenDialog={setOpenDialog}
                    key={`${course}+${index}`}
                />
            ))}
        </Grid>
    );
};

export default CoursesList;

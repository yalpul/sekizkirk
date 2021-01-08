import React, { useState, useEffect, useContext } from "react";

import {
    CoursesContext,
    DELETE_COURSE,
    DELETE_ALL,
    ELECTIVE_SELECT,
} from "../CoursesContext";
import { DataContext } from "../DataContext";
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
import InfoIcon from "@material-ui/icons/Info";
import Tooltip from "@material-ui/core/Tooltip";

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

const CoursesList = ({ openDialog, setOpenDialog }) => {
    const classes = useStyles();
    const { coursesState, dispatch } = useContext(CoursesContext);
    const { uniqueCourses, electiveCourses } = coursesState;
    const { courseSlots } = useContext(DataContext);

    const [coursesMouseOver, setCoursesMouseOver] = useState(null);
    const [electivesMouseOver, setElectivesMouseOver] = useState(null);

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

    const handleElectiveDelete = (index) => {
        dispatch({ type: ELECTIVE_SELECT, payload: { index } });
    };

    useEffect(() => {
        if (openDialog === null) {
            setCoursesMouseOver(null);
        }
    }, [openDialog]);

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
                        {uniqueCourses.map((course, index) => {
                            const dataNotAvaliable =
                                courseSlots[course.code].length === 0;

                            return course ? (
                                <ListItem
                                    key={`${course.title}+${course.code}`}
                                    button={dataNotAvaliable ? false : true}
                                    onClick={
                                        dataNotAvaliable
                                            ? null
                                            : () => setOpenDialog(index)
                                    }
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
                                    {dataNotAvaliable && (
                                        <ListItemIcon>
                                            <Tooltip
                                                title="This course does not have any sections. It will not be included in schedule table."
                                                arrow
                                            >
                                                <InfoIcon color="secondary" />
                                            </Tooltip>
                                        </ListItemIcon>
                                    )}
                                    <ListItemText
                                        primary={course.title}
                                        inset={dataNotAvaliable ? false : true}
                                    />
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
                                className={classes.listItem}
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
                                <ListItemText
                                    primary={`Add your ${type}`}
                                    inset
                                />
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

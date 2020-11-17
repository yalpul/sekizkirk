import React from "react";

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

const CoursesList = ({
    courses,
    setManualCourses,
    setSemester,
    setSectionChecks,
    setAllowCollision,
    mustCourses,
    setMustCourses,
    manualCourses,
    sectionChecks,
    allowCollision,
    electiveCourses,
    setElectiveCourses,
    setOpenDialog,
}) => {
    const classes = useStyles();

    const handleClearAll = () => {
        setManualCourses([]);

        // setting semester to unselected, deletes all must courses
        setSemester("");

        // reset settings
        setSectionChecks({});
        setAllowCollision({});
    };

    const handleDeleteCourse = (course) => {
        // remember, course might be included in both of the arrays
        const newMust = mustCourses.filter((item) => item !== course);
        setMustCourses(newMust);

        const newManual = manualCourses.filter((item) => item !== course);
        setManualCourses(newManual);

        setSectionChecks({ ...sectionChecks, [course.code]: undefined });
        setAllowCollision({ ...allowCollision, [course.code]: undefined });
    };

    const handleElectiveClick = (index) => {
        document.getElementById("course-select").focus();

        const tempElectives = [...electiveCourses];
        tempElectives.splice(index, 1);
        setElectiveCourses(tempElectives);
    };

    return (
        <Grid item className={classes.courseListContainer}>
            {courses.length > 0 && (
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
                                onClick={(index) => handleElectiveClick(index)}
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
        </Grid>
    );
};

export default CoursesList;

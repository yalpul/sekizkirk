import React, { useContext, useEffect, useState } from "react";

import { DataContext } from "../DataContext";
import {
    CoursesContext,
    UNSELECT_ALL_SECTIONS,
    TOGGLE_CHECK,
    TOGGLE_COLLISION,
    TOGGLE_INSTRUCTOR,
} from "../CoursesContext";

import { useTheme, makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
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
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import FilterListIcon from "@material-ui/icons/FilterList";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Chip from "@material-ui/core/Chip";

const useStyles = makeStyles((theme) => ({
    chipContainer: {
        marginTop: "0.5em",
        marginBottom: "0.5em",
    },
    chip: {
        color: "#fff",
        marginRight: "0.5em",
        marginBottom: "0.5em",
        "&:focus": {
            backgroundColor: theme.palette.common.sekizkirkGrey,
        },
    },
}));

const SectionOptions = ({ index, course, openDialog, setOpenDialog }) => {
    const classes = useStyles();
    const theme = useTheme();

    const { courseSlots } = useContext(DataContext);
    const { coursesState, dispatch } = useContext(CoursesContext);
    const {
        manuelCourses,
        mustCourses,
        sectionChecks,
        allowCollision,
        fixedSections,
    } = coursesState;

    const [instructors, setInstuctors] = useState([]);
    const [showInstructors, setShowInstructors] = useState(false);
    const [instructorActive, setInstructorActive] = useState([]);

    const handleUnselectAll = (course) => {
        dispatch({ type: UNSELECT_ALL_SECTIONS, payload: { course } });
    };

    const handleCheck = (course, index) => {
        dispatch({ type: TOGGLE_CHECK, payload: { course, index } });
    };

    const handleCollisionCheck = (course) => {
        dispatch({ type: TOGGLE_COLLISION, payload: { course } });
    };

    const handleInstructorClick = (index) => {
        const temp = [...instructorActive];
        temp[index] = !temp[index];
        setInstructorActive(temp);

        dispatch({
            type: TOGGLE_INSTRUCTOR,
            payload: {
                courseCode: course.code,
                instructorName: instructors[index],
                active: temp[index],
            },
        });
    };

    useEffect(() => {
        const getInstructors = () => {
            // unique instructors
            return [
                ...new Set(
                    courseSlots[course.code].map((slot) => {
                        const [, , , instructorName] = slot;
                        return instructorName;
                    })
                ),
            ];
        };

        const instructors = getInstructors();
        setInstuctors(instructors);
        setInstructorActive(instructors.map(() => true));
        setShowInstructors(false);
    }, [manuelCourses, mustCourses]);

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
                            <FormLabel component="legend" focused={false}>
                                Course Options
                            </FormLabel>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        color="primary"
                                        checked={allowCollision[course.code]}
                                        onChange={() =>
                                            handleCollisionCheck(course)
                                        }
                                    />
                                }
                                label="Allow Collision"
                            />
                        </FormControl>
                    </Grid>

                    <Grid item style={{ marginTop: "1em" }}>
                        <FormControl component="fieldset">
                            <FormLabel component="legend" focused={false}>
                                <Grid container direction="column">
                                    <Grid item>
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
                                                {!fixedSections[
                                                    course.code
                                                ] && (
                                                    <Tooltip
                                                        title="filter by instructor"
                                                        arrow
                                                        enterDelay={500}
                                                    >
                                                        <IconButton
                                                            aria-label="filter"
                                                            color="secondary"
                                                            onClick={() =>
                                                                setShowInstructors(
                                                                    !showInstructors
                                                                )
                                                            }
                                                        >
                                                            <FilterListIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                            </Grid>

                                            <Grid item>
                                                {fixedSections[course.code] && (
                                                    <Tooltip
                                                        arrow
                                                        title="Unfix section in the table to enable selection."
                                                    >
                                                        <HelpIcon color="primary" />
                                                    </Tooltip>
                                                )}
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    <Grid
                                        item
                                        className={classes.chipContainer}
                                    >
                                        {!fixedSections[course.code] &&
                                            showInstructors &&
                                            instructors.map(
                                                (instructor, index) => (
                                                    <Chip
                                                        label={instructor}
                                                        key={instructor}
                                                        className={classes.chip}
                                                        clickable
                                                        style={{
                                                            backgroundColor: instructorActive[
                                                                index
                                                            ]
                                                                ? theme.palette
                                                                      .primary
                                                                      .light
                                                                : undefined,
                                                        }}
                                                        onClick={() =>
                                                            handleInstructorClick(
                                                                index
                                                            )
                                                        }
                                                    />
                                                )
                                            )}
                                    </Grid>
                                </Grid>
                            </FormLabel>
                            <FormGroup aria-label="position" row>
                                {sectionChecks[course.code].map(
                                    (checked, index) => {
                                        const [sectionName] = courseSlots[
                                            course.code
                                        ][index];

                                        return (
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        color="primary"
                                                        checked={checked}
                                                        onChange={() =>
                                                            handleCheck(
                                                                course,
                                                                index
                                                            )
                                                        }
                                                        disabled={
                                                            fixedSections[
                                                                course.code
                                                            ]
                                                        }
                                                    />
                                                }
                                                label={sectionName}
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
                <Button onClick={() => setOpenDialog(null)} color="secondary">
                    ok
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SectionOptions;

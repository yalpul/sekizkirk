import React, { useContext, useEffect, useState } from "react";

import { makeStyles } from "@material-ui/core/styles";

import Grid from "@material-ui/core/Grid";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import Typography from "@material-ui/core/Typography";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Collapse from "@material-ui/core/Collapse";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Button from "@material-ui/core/Button";
import NotInterestedIcon from "@material-ui/icons/NotInterested";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";
import CircularProgress from "@material-ui/core/CircularProgress";
import Tooltip from "@material-ui/core/Tooltip";

import { DataContext } from "../DataContext";
import { CoursesContext } from "../CoursesContext";
import {
    DisplayContext,
    UPDATE_POSSIBLE_SCHEDULES,
    DELETE_FROM_FAVS,
    ADD_TO_FAVS,
    TOGGLE_DONT_FILL,
} from "../DisplayContext";
import { scheduleHash } from "../../utils";
import { days, hours, cellColors } from "../../constants";
import CellDisplay from "./CellDisplay";
import ScrollTop from "./ScrollTop";
import SendButton from "./SendButton";
import { distance, insideParanthesisRegex } from "./utils";

const useStyles = makeStyles((theme) => ({
    mainContainer: {
        minHeight: "100vh",
        backgroundColor: theme.palette.common.sekizkirkGrey,
        position: "relative", // for positining `scrollTop` component absolutely to the right bottom
    },
    tableContainer: {
        width: "80%",
        marginTop: "1.5em",
        marginBottom: "1em",
    },
    restristionsContainer: {
        marginBottom: "1.5em",
    },
    cellButton: {
        borderRadius: 5,
        padding: 0,
        height: "3.5em",
        width: "95%",
    },
    showFavButton: {
        position: "absolute",
        right: 0,
        marginRight: "1em",
        color: theme.palette.secondary.main.light,
        fontWeight: 700,
    },
}));

let worker = new Worker("../../workers/scheduleWorker.js");

export default function ScheduleTable({ tableDisplay, openDialog, mustDept }) {
    const classes = useStyles();

    const {
        coursesState: {
            uniqueCourses,
            allowCollision,
            fixedSections,
            sectionChecks,
        },
    } = useContext(CoursesContext);

    const {
        displayState: { possibleSchedules, dontFills, favSchedules },
        dispatch,
    } = useContext(DisplayContext);

    const { courseSlots, departments } = useContext(DataContext);

    const [loading, setLoading] = useState(false);
    const [isFavsActive, setIsFavsActive] = useState(false);
    const [displayedSchedules, setDisplayedSchedules] = useState([]);
    const [currentSchedule, setCurrentSchedule] = useState(0);
    const [currentDisplay, setCurrentDisplay] = useState(null);
    const [lastShownSchedule, setLastShownSchedule] = useState(null);

    const [surnameCheck, setSurnameCheck] = useState(false);
    const [surname, setSurname] = useState("");
    const [firstTwoLetters, setFirstTwoLetters] = useState("");

    const [deptCheck, setDeptCheck] = useState(false);
    const [dept, setDept] = useState(null);

    const updateDisplay = () => {
        const newDisplay = hours.map(() => days.map(() => []));

        try {
            displayedSchedules[currentSchedule].map(
                ([course, sectionID], index) => {
                    const section = courseSlots[course.code][sectionID];
                    const [sectionName, sectionSlots] = section;
                    const backgroundColor =
                        cellColors[index % cellColors.length];

                    sectionSlots.forEach((slot) => {
                        const [day, hour, classroom] = slot;

                        // update table slot for this section
                        newDisplay[hour][day].push({
                            name: `${
                                course.title.split(" ", 1)[0] // only show plain code
                            }/${sectionName}`,
                            bg: `${backgroundColor}`,
                            courseCode: course.code,
                            sectionID,
                            classroom,
                        });
                    });
                }
            );
            setCurrentDisplay(newDisplay);
        } catch {
            // displayedSchedules hasn't initialized yet.
            setCurrentDisplay(newDisplay);
        }
    };

    function findCandidateCourseSections(courses) {
        const candidateCourseSections = [];
        courses.forEach((course) => {
            if (courseSlots[course.code].length === 0) {
                // sections slots data not avaliable for the course,
                // don't include it into calculations.
                // Otherwise, there would be no possible schedules.
                return;
            }

            // each course has its own array of sections
            const sections = courseSlots[course.code];
            const candidateSections = sections
                .map((section, sectionIndex) => {
                    const [, sectionSlots, constraints] = section;

                    const isConstraintsEmpty =
                        Object.keys(constraints).length === 0;
                    const applyDeptConstraint = deptCheck && dept !== null;
                    const applySurnameContraint =
                        surnameCheck && firstTwoLetters.length === 2;

                    if (sectionSlots.length === 0) {
                        // slots data not avaliable
                        return null;
                    }

                    if (
                        // sectionChecks[course.code] &&
                        sectionChecks[course.code][sectionIndex] === false
                    ) {
                        // this section omitted by the user
                        return null;
                    }

                    // only apply constraints if there is data avaiable for it.
                    if (!isConstraintsEmpty) {
                        if (applyDeptConstraint && applySurnameContraint) {
                            let surnameList;
                            const letters = firstTwoLetters.toLocaleUpperCase(
                                "TR"
                            );

                            if (constraints["ALL"])
                                surnameList = constraints["ALL"];
                            else if (constraints[dept.title])
                                surnameList = constraints[dept.title];
                            else return null;

                            for (let [surStart, surEnd] of surnameList) {
                                if (
                                    distance(surStart[0], surStart[1]) <=
                                        distance(letters[0], letters[1]) &&
                                    distance(letters[0], letters[1]) <=
                                        distance(surEnd[0], surEnd[1])
                                ) {
                                    return [course, sectionIndex];
                                }
                            }

                            return null;
                        } else if (applyDeptConstraint) {
                            // pass only if selected department is included in constraints or
                            // `ALL` included as wildcard.
                            if (
                                !constraints["ALL"] &&
                                !constraints[dept.title]
                            ) {
                                return null;
                            }
                        } else if (applySurnameContraint) {
                            const surnameList = constraints["NONE"];
                            const letters = firstTwoLetters.toUpperCase();

                            for (let [surStart, surEnd] of surnameList) {
                                if (
                                    distance(surStart[0], surStart[1]) <=
                                        distance(letters[0], letters[1]) &&
                                    distance(letters[0], letters[1]) <=
                                        distance(surEnd[0], surEnd[1])
                                ) {
                                    return [course, sectionIndex];
                                }
                            }

                            return null;
                        }
                    }

                    // section passed all tests
                    return [course, sectionIndex];
                })
                .filter((slots) => slots !== null);

            candidateCourseSections.push(candidateSections);
        });
        // sort courses as their section number, ascending order
        candidateCourseSections.sort((a, b) => a.length - b.length);

        return candidateCourseSections;
    }

    function updateSchedules() {
        // terminate pending workers if updateSchedules invoked consecutive
        worker.terminate();

        setLoading(true);
        const candidateCourseSections = findCandidateCourseSections(
            uniqueCourses
        );

        // if there are courses without any candidate sections,
        // making a schedule is impossible. This accually means none of the
        // sections of that course pass the constraint filters.
        const nonEmptyCourses = candidateCourseSections.filter(
            (courseSections) => courseSections.length !== 0
        );
        if (nonEmptyCourses.length !== candidateCourseSections.length) {
            dispatch({
                type: UPDATE_POSSIBLE_SCHEDULES,
                payload: { schedules: [] },
            });
            setLoading(false);
            return;
        }

        // All courses have candidate sections.
        // Run worker to find possible schedules.
        worker = new Worker("../../workers/scheduleWorker.js");
        worker.addEventListener("message", (message) => {
            const schedules = message.data;
            dispatch({
                type: UPDATE_POSSIBLE_SCHEDULES,
                payload: { schedules },
            });
            setLoading(false);
            worker.terminate();
        });

        worker.postMessage({
            allowCollision,
            courseSlots,
            candidateCourseSections,
            dontFills,
        });
    }

    useEffect(() => {
        // Schedules will be updated in the following situations:
        // 1. user adds or deletes course(s).
        // 2. user changes any don't fill areas in the UI.
        // 3. user fixes any course section
        // 4. user applies surname constraint
        // 5. user applies department constraint

        updateSchedules();
    }, [uniqueCourses, dontFills, fixedSections, firstTwoLetters]);

    useEffect(() => {
        // Insead of updating schedule in every `section check` change,
        // Only update when user closes the `section modal`
        // This prevents unnecessary updates when user unchecks or checks multiple sections at once.
        //
        // Drawback of this solution is, when the user opens the modal and not change any section option,
        // schedules will be updated when the modal closes.

        if (openDialog === null) {
            updateSchedules();
        }
    }, [openDialog]);

    useEffect(() => {
        // Displayed schedule will be updated in the following situations:
        // 1. User decides to see another schedule in possible schedules.
        // 2. User switches between favorite and all schedules
        updateDisplay();
    }, [currentSchedule, displayedSchedules]);

    useEffect(() => {
        // When possible schedules updated via `updateSchedules`,
        // switch to the all schedules if you are in the favorite schedules.
        setDisplayedSchedules(possibleSchedules);
        setCurrentSchedule(0);
        setIsFavsActive(false);
    }, [possibleSchedules]);

    useEffect(() => {
        // When user switched to the favorites, start with the first one.
        // Remember the last schedule place in the all schedules so,
        // when user switches back to the all schedules, continue from there.
        if (isFavsActive) {
            setDisplayedSchedules(Object.values(favSchedules));
            setLastShownSchedule(currentSchedule);
            setCurrentSchedule(0);
        } else {
            setDisplayedSchedules(possibleSchedules);
            setCurrentSchedule(lastShownSchedule);
        }
    }, [isFavsActive]);

    useEffect(() => {
        // if user deletes any favorite while in the favorite section,
        // update favorites
        const favs = Object.values(favSchedules);
        if (isFavsActive) {
            setDisplayedSchedules(favs);
            setCurrentSchedule(currentSchedule % favs.length || 0);
        }
    }, [favSchedules]);

    useEffect(() => {
        // OIBS only checks surname constraints accourding to first two letters
        // of the surname. Remaining letters doesn't count in calculations.

        const match = surname.match(insideParanthesisRegex);
        if (match) {
            setFirstTwoLetters(match[1]);
        } else {
            setFirstTwoLetters("");
        }
    }, [surname]);

    useEffect(() => {
        // when surname constraint unchecked, clear surname section
        //
        // `firstTwoLetters.length === 2` condition prevents unnecassry renders when
        //  uncheking while there is no surname input
        if (surnameCheck === false && firstTwoLetters.length === 2) {
            setSurname("");
        }
    }, [surnameCheck]);

    useEffect(() => {
        // when department constraint unchecked, clear dept section
        //
        // `dept !== null` condition prevents unnecarry update.
        if (dept !== null) {
            updateSchedules();
        }
    }, [deptCheck]);

    useEffect(() => {
        // avoids updating table when user select must department
        // but not check the department constraint yet.
        if (deptCheck) {
            updateSchedules();
        }
    }, [dept]);

    useEffect(() => {
        // when user select must course, also set it as default department for constraint.
        setDept(mustDept);
    }, [mustDept]);

    // // handlers
    const handleNavigateClick = (direction) => {
        if (direction === "next") {
            currentSchedule < displayedSchedules.length - 1
                ? setCurrentSchedule(currentSchedule + 1)
                : setCurrentSchedule(0);
        } else if (direction === "prev" && displayedSchedules.length > 0) {
            currentSchedule === 0
                ? setCurrentSchedule(displayedSchedules.length - 1)
                : setCurrentSchedule(currentSchedule - 1);
        }
    };

    const handleSurnameChange = (event) => {
        const value = event.target.value;
        if (value.length === 2) {
            // wrap first two letters with paranthesis.
            setSurname(`(${value})`);
        } else if (
            value.length > 2 &&
            value.match(insideParanthesisRegex) === null
        ) {
            // clear input when user attempts to clear first two letters.
            setSurname("");
        } else {
            setSurname(value);
        }
    };

    const handleCellClick = (hourIndex, dayIndex) => {
        // toggle clicked cells don't fill value
        dispatch({ type: TOGGLE_DONT_FILL, payload: { hourIndex, dayIndex } });
    };

    const handleFavClick = () => {
        const schedule = possibleSchedules[currentSchedule];
        const hash = scheduleHash(schedule);

        dispatch({ type: ADD_TO_FAVS, payload: { hash, schedule } });
    };

    const handleUnfavClick = () => {
        const schedule = displayedSchedules[currentSchedule];
        const hash = scheduleHash(schedule);

        dispatch({ type: DELETE_FROM_FAVS, payload: { hash } });
    };

    const handleToggleFavs = () => {
        setIsFavsActive(!isFavsActive);
    };

    return (
        <Grid
            container
            className={classes.mainContainer}
            style={{ display: tableDisplay }}
            id="schedule-table"
            direction="column"
            alignItems="center"
        >
            <ScrollTop />
            {/* table  */}
            <Grid item className={classes.tableContainer}>
                <TableContainer component={Paper}>
                    <Table>
                        <caption>
                            <Grid
                                container
                                justify="center"
                                alignItems="center"
                                style={{ position: "relative" }}
                            >
                                <SendButton
                                    schedule={
                                        displayedSchedules[currentSchedule]
                                    }
                                />
                                {loading ? (
                                    <CircularProgress />
                                ) : (
                                    <>
                                        <Grid item>
                                            <IconButton
                                                onClick={() =>
                                                    handleNavigateClick("prev")
                                                }
                                            >
                                                <NavigateBeforeIcon />
                                            </IconButton>
                                        </Grid>
                                        <Grid item>
                                            <Typography variantion="body1">{`${
                                                displayedSchedules.length
                                                    ? currentSchedule + 1
                                                    : currentSchedule
                                            }/${
                                                displayedSchedules.length
                                            }`}</Typography>
                                        </Grid>
                                        <Grid item>
                                            <IconButton
                                                onClick={() =>
                                                    handleNavigateClick("next")
                                                }
                                            >
                                                <NavigateNextIcon />
                                            </IconButton>
                                        </Grid>
                                    </>
                                )}
                                <Button
                                    size="small"
                                    variant="outlined"
                                    className={classes.showFavButton}
                                    onClick={handleToggleFavs}
                                >
                                    {isFavsActive
                                        ? "show all"
                                        : "show favorites"}
                                </Button>
                            </Grid>
                        </caption>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">
                                    {displayedSchedules[currentSchedule] &&
                                    favSchedules[
                                        scheduleHash(
                                            displayedSchedules[currentSchedule]
                                        )
                                    ] ? (
                                        <Tooltip title="remove" arrow>
                                            <IconButton
                                                onClick={handleUnfavClick}
                                            >
                                                <FavoriteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    ) : (
                                        <Tooltip title="add to favorites" arrow>
                                            <IconButton
                                                onClick={handleFavClick}
                                            >
                                                <FavoriteBorderIcon />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                </TableCell>
                                {days.map((day) => (
                                    <TableCell key={day} align="center">
                                        {day}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {currentDisplay &&
                                currentDisplay.map((hour, hourIndex) => (
                                    <TableRow key={`${hour}+${hourIndex}`}>
                                        <TableCell
                                            component="th"
                                            style={{ width: "150px" }}
                                            align="center"
                                        >
                                            {hours[hourIndex]}
                                        </TableCell>
                                        {hour.map((day, dayIndex) => {
                                            const dontFill =
                                                dontFills[hourIndex][dayIndex];
                                            return (
                                                <TableCell
                                                    key={`${day}+${dayIndex}`}
                                                    align="center"
                                                    style={{
                                                        padding: 0,
                                                        width: "150px",
                                                    }}
                                                >
                                                    {day.length === 0 ? (
                                                        // no course to displayed at this slot
                                                        <Button
                                                            className={
                                                                classes.cellButton
                                                            }
                                                            onClick={() =>
                                                                handleCellClick(
                                                                    hourIndex,
                                                                    dayIndex
                                                                )
                                                            }
                                                            disabled={
                                                                isFavsActive
                                                            }
                                                            disableRipple
                                                            style={{
                                                                backgroundColor:
                                                                    dontFill &&
                                                                    !isFavsActive
                                                                        ? "#000"
                                                                        : undefined,
                                                                color:
                                                                    dontFill &&
                                                                    !isFavsActive
                                                                        ? "#b80f0a"
                                                                        : "#FFF",
                                                            }}
                                                            startIcon={
                                                                dontFill &&
                                                                !isFavsActive ? (
                                                                    <NotInterestedIcon />
                                                                ) : undefined
                                                            }
                                                        >
                                                            {dontFill &&
                                                            !isFavsActive
                                                                ? "Don't Fill"
                                                                : undefined}
                                                        </Button>
                                                    ) : (
                                                        day.map(
                                                            ({
                                                                name,
                                                                bg,
                                                                courseCode,
                                                                sectionID,
                                                                classroom,
                                                            }) => (
                                                                <CellDisplay
                                                                    key={name}
                                                                    name={name}
                                                                    bg={bg}
                                                                    courseCode={
                                                                        courseCode
                                                                    }
                                                                    sectionID={
                                                                        sectionID
                                                                    }
                                                                    classroom={
                                                                        classroom
                                                                    }
                                                                    isFavsActive={
                                                                        isFavsActive
                                                                    }
                                                                    dontFillHandler={() =>
                                                                        handleCellClick(
                                                                            hourIndex,
                                                                            dayIndex
                                                                        )
                                                                    }
                                                                />
                                                            )
                                                        )
                                                    )}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>

            {/* restristions */}
            <Grid
                item
                container
                direction="row"
                justify="center"
                className={classes.restristionsContainer}
            >
                <Grid item>
                    <Grid item container direction="column">
                        <Grid item>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={surnameCheck}
                                        onChange={() => {
                                            setSurnameCheck(!surnameCheck);
                                        }}
                                        name="checkedB"
                                        color="primary"
                                    />
                                }
                                label="Check Surname"
                            />
                        </Grid>
                        <Grid item>
                            <Collapse in={surnameCheck} timeout={0}>
                                <TextField
                                    label="Surname"
                                    size="small"
                                    margin="dense"
                                    value={surname}
                                    onChange={handleSurnameChange}
                                    style={{
                                        marginTop: "-10px",
                                        width: "90%",
                                    }}
                                    color="secondary"
                                />
                            </Collapse>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item>
                    <Grid item container direction="column">
                        <Grid item>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={deptCheck}
                                        onChange={() => {
                                            setDeptCheck(!deptCheck);
                                        }}
                                        name="checkedB"
                                        color="primary"
                                    />
                                }
                                label="Check Department"
                            />
                        </Grid>
                        <Grid item>
                            <Collapse in={deptCheck} timeout={0}>
                                <Autocomplete
                                    options={departments}
                                    getOptionLabel={(department) =>
                                        department.title
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            style={{
                                                marginTop: "-13px",
                                                width: "90%",
                                            }}
                                            label="Department"
                                        />
                                    )}
                                    onChange={(event, value) => {
                                        setDept(value);
                                    }}
                                    popupIcon={<></>} // no icon
                                    fullWidth
                                    clearOnEscape
                                    autoSelect
                                    blurOnSelect
                                    autoHighlight
                                    noOptionsText="Not found."
                                    value={dept}
                                />
                            </Collapse>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

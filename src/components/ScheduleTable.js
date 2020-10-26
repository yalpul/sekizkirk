import React, { useContext, useEffect, useState } from "react";

import { makeStyles, useTheme } from "@material-ui/core/styles";

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

import DataContext from "./DataContext";

const useStyles = makeStyles((theme) => ({
    mainContainer: {
        minHeight: "100vh",
        backgroundColor: theme.palette.common.sekizkirkGrey,
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
}));

export default function ScheduleTable({
    courses,
    display,
    mustDept,
    sectionChecks,
    allowCollision,
}) {
    const data = useContext(DataContext);
    const classes = useStyles();

    const slotsData = data.courseSlots;
    const courseData = data.courses;

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
    const hours = [
        "8:40-9:40",
        "9:40-10:40",
        "10:40-11:40",
        "11:40-12:40",
        "12:40-13:40",
        "13:40-14:40",
        "14:40-15:40",
        "15:40-16:40",
        "16:40-17:40",
    ];
    const cellColors = [
        "#002E2E",
        "#7A00CC",
        "#29A329",
        "#CCCC00",
        "#00CCCC",
        "#00008A",
        "#666633",
        "#002900",
        "#005C5C",
        "#00FF00",
        "#E62EB8",
        "#CC3300",
        "#808080",
        "#CC0000",
    ];

    const [displayedSlot, setDisplayedSlot] = useState(
        hours.map(() => days.map(() => ({ name: "", bg: undefined })))
    );
    const [possibleSchedules, setPossibleSchedules] = useState([]); // [schedule1->[[{course}, sectionID]] ,]
    const [currentSchedule, setCurrentSchedule] = useState(null);

    const [surnameCheck, setSurnameCheck] = useState(false);
    const [surname, setSurname] = useState("");
    const [firstTwoLetters, setFirstTwoLetters] = useState("");

    const [deptCheck, setDeptCheck] = useState(false);
    const [dept, setDept] = useState(null);

    const [dontFills, setDontFills] = useState(
        hours.map(() => days.map(() => false))
    );

    // helper functions
    const updateTempTable = (course, sectionID, tempTable, backgroundColor) => {
        const section = slotsData[course.code][sectionID];
        const [sectionSlots, _] = section;

        sectionSlots.forEach((slot) => {
            const [day, hour] = slot;

            // update table slot for this section
            tempTable[hour][day].name = `${
                courseData[course.code].title.split(" ", 1)[0] // only show plain code
            }/${sectionID + 1}`;

            tempTable[hour][day].bg = `${backgroundColor}`;
        });
    };

    const findPossibleSchedules = (candidateCourseSections) => {
        const validSchedules = [];
        const possibleSchedule = [];
        let lookup = {};

        function modifyLookUp([course, sectionID], action) {
            if (allowCollision[course.code] === true) {
                // course allowed to have collisions,
                // don't modifiy the lookup(allow collisions)
                return;
            }

            const section = slotsData[course.code][sectionID];
            const [sectionSlots, _] = section;
            sectionSlots.forEach((slot) => {
                const [day, hour] = slot;
                if (action === "update") {
                    lookup[[day, hour]] = 1;
                } else if (action === "delete") {
                    delete lookup[[day, hour]];
                }
            });
        }

        function checkCollision(section) {
            possibleSchedule.push([...section]);

            const [course, sectionID] = section;
            const slots = slotsData[course.code][sectionID];
            const [sectionSlots, _] = slots;

            // don't fill have the hightes priority,
            // check it first
            for (let slot of sectionSlots) {
                const [day, hour] = slot;

                if (dontFills[hour][day] === true) {
                    // slot is on don't fill area
                    return false;
                }
            }

            // this course is allowed to have collisions
            // don't check collisions
            if (allowCollision[course.code] === true) {
                return true;
            }

            for (let slot of sectionSlots) {
                const [day, hour] = slot;

                // collison of slots occured
                if (lookup[[day, hour]] === 1) {
                    return false;
                }
            }

            // no collisions occured
            return true;
        }

        (function runner(candidateCourseSections) {
            // base case, combination is a valid schedule, save it to the state
            if (candidateCourseSections.length === 0) {
                validSchedules.push([...possibleSchedule]);
                return;
            }

            let courseSections = candidateCourseSections[0];

            if (courseSections.length === 0) {
                // current course lack slots information,
                runner(candidateCourseSections.slice(1));
            }

            courseSections.forEach((section) => {
                if (checkCollision(section)) {
                    modifyLookUp(section, "update");
                    runner(candidateCourseSections.slice(1));
                    modifyLookUp(section, "delete");
                }
                possibleSchedule.pop();
            });
        })(candidateCourseSections);

        return validSchedules;
    };

    function updateTable() {
        const candidateCourseSections = [];
        console.log("update");
        courses.forEach((course, courseIndex) => {
            // each course has its own array of sections
            const sections = slotsData[course.code];
            candidateCourseSections[courseIndex] = sections
                .map((section, sectionIndex) => {
                    const [sectionSlots, constraints] = section;

                    if (sectionSlots.length === 0) {
                        // slots data not avaliable
                        return null;
                    } else if (
                        sectionChecks[course.code] &&
                        sectionChecks[course.code][sectionIndex] === false
                    ) {
                        // this section omitted by the user
                        return null;
                    } else if (deptCheck && dept !== null) {
                        //  dept constraint applied
                        try {
                            const [[deptConstraint]] = constraints;
                            if (
                                deptConstraint !== "ALL" &&
                                deptConstraint !== dept.title
                            ) {
                                return null;
                            }
                        } catch (err) {
                            // constraint data not avaliable
                            // don't apply to this section.
                            // TODO: change this behavior?
                        }
                    } else if (surnameCheck && firstTwoLetters.length === 2) {
                        // surname constraint applied
                        try {
                            const [[_, surStart, surEnd]] = constraints;
                            const letters = firstTwoLetters.toUpperCase();
                            if (!(surStart <= letters && letters <= surEnd)) {
                                return null;
                            }
                        } catch (err) {
                            // constraint data not avaliable
                            // don't apply to this section.
                            // TODO: change this behavior?
                        }
                    }
                    return [course, sectionIndex];
                })
                .filter((slots) => slots !== null);
        });
        // sort courses as their section number, ascending order
        candidateCourseSections.sort((a, b) => a.length - b.length);

        const schedules = findPossibleSchedules(candidateCourseSections);
        setPossibleSchedules(schedules);
    }

    useEffect(() => {
        if (courses.length > 0) {
            updateTable();
        } else {
            setPossibleSchedules([]);
        }
    }, [courses]);

    useEffect(() => {
        // letters inside the paranthesis
        const insideParanthesis = /^\((\w\w)\)/;
        const match = surname.match(insideParanthesis);
        if (match) {
            setFirstTwoLetters(match[1]);
        } else {
            setFirstTwoLetters("");
        }
    }, [surname]);

    useEffect(() => {
        updateTable();
    }, [firstTwoLetters]);

    useEffect(() => {
        if (surnameCheck === false && firstTwoLetters.length === 2) {
            // TODO: maybe apply this only if the table's previous state was surname constrained.
            updateTable();
            setSurname("");
        }
    }, [surnameCheck]);

    useEffect(() => {
        const tempTable = hours.map(() =>
            days.map(() => ({ name: "", bg: undefined }))
        );

        const schedule = possibleSchedules[currentSchedule] || [];
        schedule.forEach(([course, sectionID], index) => {
            const backgroundColor = cellColors[index % cellColors.length];
            updateTempTable(course, sectionID, tempTable, backgroundColor);
        });

        setDisplayedSlot(tempTable);
    }, [currentSchedule, possibleSchedules]);

    useEffect(() => {
        if (possibleSchedules.length > 0) {
            setCurrentSchedule(0);
        } else {
            setCurrentSchedule(null);
        }
    }, [possibleSchedules]);

    useEffect(() => {
        setDept(mustDept);
    }, [mustDept]);

    useEffect(() => {
        if (deptCheck === true && dept !== null) {
            updateTable();
        } else if (deptCheck === false && dept !== null) {
            updateTable();
            setDept(mustDept);
        }
    }, [deptCheck]);

    useEffect(() => {
        if (deptCheck) {
            updateTable();
        }
    }, [dept]);

    useEffect(() => {
        updateTable();
    }, [dontFills, sectionChecks, allowCollision]);

    // useEffect(() => {
    //     updateTable();
    // }, [sectionChecks]);

    // useEffect(() => {
    //     updateTable();
    // }, [allowCollision]);

    // handlers
    const handleNavigateClick = (direction) => {
        if (direction === "next" && possibleSchedules.length > 0) {
            currentSchedule === possibleSchedules.length - 1
                ? setCurrentSchedule(0)
                : setCurrentSchedule(currentSchedule + 1);
        } else if (direction === "prev" && possibleSchedules.length > 0) {
            currentSchedule === 0
                ? setCurrentSchedule(possibleSchedules.length - 1)
                : setCurrentSchedule(currentSchedule - 1);
        }
    };

    const handleSurnameChange = (event) => {
        const value = event.target.value;
        const regTest = /^\(\w\w\)/;
        if (value.length === 2) {
            setSurname(`(${value})`);
        } else if (value.length > 2 && value.match(regTest) === null) {
            setSurname("");
        } else {
            setSurname(value);
        }
    };

    const handleCellClick = (hourIndex, dayIndex) => {
        // toggle clicked cells don't fill value
        const temp = [...dontFills];
        temp[hourIndex][dayIndex] = !temp[hourIndex][dayIndex];

        setDontFills(temp);
    };

    return (
        <Grid
            container
            className={classes.mainContainer}
            style={{ display: display }}
            id="schedule-table"
            direction="column"
            alignItems="center"
        >
            {/* table  */}
            <Grid item className={classes.tableContainer}>
                <TableContainer component={Paper}>
                    <Table>
                        <caption>
                            <Grid
                                container
                                justify="center"
                                alignItems="center"
                            >
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
                                        currentSchedule === null
                                            ? 0
                                            : currentSchedule + 1
                                    }/${possibleSchedules.length}`}</Typography>
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
                            </Grid>
                        </caption>
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                {days.map((day) => (
                                    <TableCell key={day} align="center">
                                        {day}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {displayedSlot.map((hour, hourIndex) => (
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
                                                    disableRipple
                                                    style={{
                                                        backgroundColor: dontFill
                                                            ? "#000"
                                                            : day.bg,
                                                        color: dontFill
                                                            ? "#b80f0a"
                                                            : "#FFF",
                                                    }}
                                                    startIcon={
                                                        dontFill ? (
                                                            <NotInterestedIcon />
                                                        ) : undefined
                                                    }
                                                >
                                                    {dontFill
                                                        ? "Don't Fill"
                                                        : day.name}
                                                </Button>
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
                                    options={data.departments}
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

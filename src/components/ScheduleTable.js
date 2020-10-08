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

import DataContext from "./DataContext";

const useStyles = makeStyles((theme) => ({
    mainContainer: {
        minHeight: "100vh",
        backgroundColor: theme.palette.common.sekizkirkGrey,
    },
    tableContainer: {
        width: "80%",
        marginTop: "5em",
        marginBottom: "5em",
    },
}));

export default function ScheduleTable({ courses, display }) {
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

    const [displayedSlot, setDisplayedSlot] = useState(
        hours.map(() => days.map(() => ""))
    );
    const [possibleSchedules, setPossibleSchedules] = useState([]); // [schedule1->[[{course}, sectionID]] ,]
    const [currentSchedule, setCurrentSchedule] = useState(null);

    // helper functions
    const updateTempTable = (course, sectionID, tempTable) => {
        const section = slotsData[course.code][sectionID];
        const [sectionSlots, _] = section;

        sectionSlots.forEach((slot) => {
            const [day, hour] = slot;

            // update table slot for this section
            tempTable[hour][day] = `${
                courseData[course.code].title.split(" ", 1)[0] // only show plain code
            }/${sectionID + 1}`;
        });
    };

    const findPossibleSchedules = (candidateCourseSections) => {
        const validSchedules = [];
        const possibleSchedule = [];
        let lookup = {};

        function modifyLookUp([course, sectionID], action) {
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

            for (let slot of sectionSlots) {
                const [day, hour] = slot;

                // collison of slots occured
                if (lookup[[day, hour]] === 1) {
                    return false;
                }
            }
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

    useEffect(() => {
        if (courses.length > 0) {
            const candidateCourseSections = [];
            courses.forEach((course, index) => {
                // each course has its own array of sections
                const sections = slotsData[course.code];
                candidateCourseSections[index] = sections
                    .map((section, index) => {
                        const [sectionSlots, _] = section;

                        return sectionSlots.length !== 0
                            ? [course, index]
                            : null;
                    })
                    .filter((slots) => slots !== null);
            });
            // sort courses as their section number, ascending order
            candidateCourseSections.sort((a, b) => a.length - b.length);

            const schedules = findPossibleSchedules(candidateCourseSections);
            setPossibleSchedules(schedules);
        } else {
            setPossibleSchedules([]);
        }
    }, [courses]);

    useEffect(() => {
        const tempTable = hours.map(() => days.map(() => ""));

        const schedule = possibleSchedules[currentSchedule] || [];
        schedule.forEach(([course, sectionID]) => {
            updateTempTable(course, sectionID, tempTable);
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
                            {displayedSlot.map((hour, index) => (
                                <TableRow key={`${hour}+${index}`}>
                                    <TableCell
                                        component="th"
                                        style={{ width: "150px" }}
                                        align="center"
                                    >
                                        {hours[index]}
                                    </TableCell>
                                    {hour.map((day, index) => (
                                        <TableCell
                                            key={`${day}+${index}`}
                                            align="center"
                                        >
                                            {day}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </Grid>
    );
}

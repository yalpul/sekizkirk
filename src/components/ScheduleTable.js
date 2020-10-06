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
import Button from "@material-ui/core/Button";
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
            tempTable[hour][day] = `${course.code}/${sectionID + 1}`;
        });
    };

    useEffect(() => {
        //find possible schedules
        if (courses.length > 0) {
            const temp = [];
            for (let i = 0; i < slotsData[courses[0].code].length; i++) {
                temp.push([[courses[0], i]]);
            }
            setPossibleSchedules(temp);
            setCurrentSchedule(0);
        }
    }, [courses]);

    useEffect(() => {
        const tempTable = hours.map(() => days.map(() => ""));

        const schedule = possibleSchedules[currentSchedule] || [];
        schedule.forEach(([course, sectionID]) => {
            updateTempTable(course, sectionID, tempTable);
        });

        setDisplayedSlot(tempTable);
    }, [currentSchedule]);

    // handlers
    const handleNavigateClick = (direction) => {
        if (direction === "next") {
            currentSchedule === possibleSchedules.length - 1
                ? setCurrentSchedule(0)
                : setCurrentSchedule(currentSchedule + 1);
        } else if (direction === "prev") {
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
                        {/* <TableFooter component="div"></TableFooter> */}
                    </Table>
                </TableContainer>
            </Grid>
        </Grid>
    );
}

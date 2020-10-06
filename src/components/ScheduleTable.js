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
        "17:40-18:40",
    ];

    const [displayedSlot, setDisplayedSlot] = useState(
        hours.map(() => days.map(() => ""))
    );

    // helper functions
    const updateTableForSection = (course, sectionID) => {
        const section = slotsData[course.code][sectionID];
        const [sectionSlots, _] = section;
        sectionSlots.forEach((slot) => {
            const [day, hour] = slot;

            // update table slot for this section
            const temp = [...displayedSlot];
            temp[hour][day] = `${course.code}/${sectionID + 1}`;
            setDisplayedSlot(temp);
        });
    };

    useEffect(() => {
        if (courses.length > 0) {
            const testCourse = courses[0];
            updateTableForSection(testCourse, 0);
        }
    }, [courses]);

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
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Hours</TableCell>
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

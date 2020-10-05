import React, { useContext, useState } from "react";

import { makeStyles, useTheme } from "@material-ui/core/styles";

import Grid from "@material-ui/core/Grid";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

import DataContext from "./DataContext";
import { Typography } from "@material-ui/core";

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

    // array of array for the slots,
    // outer arrays are the hours, inner arrays contains the day
    const [slots, setSlots] = useState(hours.map(() => days.map(() => "")));

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
                                    <TableCell key={day}>{day}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {slots.map((hour, index) => (
                                <TableRow key={`${hour}+${index}`}>
                                    <TableCell
                                        component="th"
                                        style={{ width: "150px" }}
                                        align="center"
                                    >
                                        {hours[index]}
                                    </TableCell>
                                    {hour.map((day, index) => (
                                        <TableCell key={`${day}+${index}`}>
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

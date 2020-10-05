import React, { useContext } from "react";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

import DataContext from "./DataContext";

const useStyles = makeStyles((theme) => ({
    mainContainer: {
        height: "100vh",
    },
}));

export default function ScheduleTable({ courses, display }) {
    const data = useContext(DataContext);
    const classes = useStyles();

    const slots = data.courseSlots;
    console.log(slots);

    return (
        <Grid
            container
            className={classes.mainContainer}
            style={{ display: display }}
            id="schedule-table"
        >
            bra
        </Grid>
    );
}

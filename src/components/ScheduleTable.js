import React, { useContext } from "react";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

import DataContext from "./DataContext";

const useStyles = makeStyles((theme) => ({
    mainContainer: {
        height: "100vh",
    },
}));

export default function ScheduleTable() {
    const data = useContext(DataContext);
    const classes = useStyles();

    return (
        <Grid container className={classes.mainContainer}>
            bra
        </Grid>
    );
}

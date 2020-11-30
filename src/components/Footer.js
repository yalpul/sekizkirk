import React, { useContext } from "react";

import { makeStyles } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import InfoIcon from "@material-ui/icons/Info";

import { DataContext } from "./DataContext";

const useStyles = makeStyles((theme) => ({
    footerContainer: {
        height: "5em",
        backgroundColor: theme.palette.secondary.dark,
        color: "#fff",
    },
    icon: {
        marginLeft: "0.5em",
    },
}));

const Footer = ({ display }) => {
    const classes = useStyles();
    const { lastUpdate } = useContext(DataContext);

    return (
        <Grid
            container
            className={classes.footerContainer}
            style={{ display: display }}
            justify="center"
            alignItems="center"
        >
            <Grid item>
                <Typography align="center">
                    Last update: <br />
                    {lastUpdate}
                </Typography>
            </Grid>
            <Grid item className={classes.icon}>
                <Tooltip
                    arrow
                    title="We ensure courses up to date with OIBS."
                    placement="top"
                >
                    <InfoIcon fontSize="small" />
                </Tooltip>
            </Grid>
        </Grid>
    );
};

export default Footer;

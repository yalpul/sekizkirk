import React, { useContext } from "react";

import { Link } from "react-router-dom";

import { makeStyles } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import InfoIcon from "@material-ui/icons/Info";
import LaunchIcon from "@material-ui/icons/Launch";

import { DataContext } from "./DataContext";

const useStyles = makeStyles((theme) => ({
    footerContainer: {
        height: "5em",
        backgroundColor: theme.palette.secondary.dark,
        color: "#fff",
        position: "relative",
    },
    icon: {
        marginLeft: "0.5em",
    },
    aboutLink: {
        position: "absolute",
        right: "10%",
        [theme.breakpoints.down("xs")]: {
            right: "5%",
        },
    },
    linkText: {
        fontSize: "1.5em",
        color: "#fff",
        textDecoration: "none",
        "&:hover": {
            color: theme.palette.primary.main,
        },
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

            <Grid item className={classes.aboutLink}>
                <Link to="/about" target="_blank" className={classes.linkText}>
                    <Grid container alignItems="center">
                        <Grid item>
                            <LaunchIcon fontSize="small" />
                        </Grid>
                        <Grid item style={{ marginLeft: "0.2em" }}>
                            {/* gutterBottom helps with aligning icon and text horizontally.
                                marginLeft creates some space from icon
                             */}
                            <Typography gutterBottom>about</Typography>
                        </Grid>
                    </Grid>
                </Link>
            </Grid>
        </Grid>
    );
};

export default Footer;

import React from "react";

import { makeStyles } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import EmailIcon from "@material-ui/icons/Email";
import Link from "@material-ui/core/Link";

const useStyles = makeStyles((theme) => ({
    container: {
        backgroundColor: theme.palette.common.sekizkirkGrey,
        height: "100vh",
        minHeight: "600px",
    },
    header: {
        marginTop: "5em",
        marginLeft: "5em",
        marginRight: "5em",
        [theme.breakpoints.down("xs")]: {
            marginLeft: "2em",
            marginRight: "2em",
        },
    },
    item: {
        marginTop: "2em",
        marginLeft: "5em",
        marginRight: "5em",
        [theme.breakpoints.down("xs")]: {
            marginLeft: "2em",
            marginRight: "2em",
        },
    },
    parag: {
        fontWeight: 700,
    },
    mail: {
        color: theme.palette.primary.main,
    },
    link: {
        marginTop: "0.5em",
        marginLeft: "5em",
        [theme.breakpoints.down("xs")]: {
            marginLeft: "2em",
            marginRight: "2em",
        },
    },
}));

const About = () => {
    const classes = useStyles();

    return (
        <Grid
            container
            direction="column"
            className={classes.container}
            wrap="nowrap"
        >
            <Grid item className={classes.header}>
                <Typography variant="h2">About</Typography>
            </Grid>

            <Grid item className={classes.item}>
                <Typography variant="body1" className={classes.parag}>
                    In our last year in METU, we wanted to create a course
                    scheduler that we wish we had in our freshman year.
                    <br />
                    So we've created sekizkirk with all the features that we
                    wanted to use as METU students.
                </Typography>
            </Grid>

            <Grid item className={classes.item}>
                <Typography variant="body1" className={classes.parag}>
                    You can reach us at:
                </Typography>
            </Grid>

            <Grid item container className={classes.item}>
                <Grid item style={{ marginRight: "0.5em" }}>
                    <EmailIcon color="primary" />
                </Grid>
                <Grid item>
                    <Typography
                        variant="body1"
                        color="primary"
                        className={classes.parag}
                    >
                        support@sekizkirk.io
                    </Typography>
                </Grid>
            </Grid>

            <Grid item className={classes.item}>
                <Typography variant="body1" className={classes.parag}>
                    If sekizkirk isn't for you, you can also check the following
                    sites created by other students:
                </Typography>
            </Grid>

            <Grid item className={classes.link}>
                <Link href="https://robotdegilim.xyz" color="secondary">
                    robotdegilim.xyz
                </Link>
            </Grid>

            <Grid item className={classes.link}>
                <Link href="http://tetick.xyz" color="secondary">
                    tetick.xyz
                </Link>
            </Grid>
        </Grid>
    );
};

export default About;

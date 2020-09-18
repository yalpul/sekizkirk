import React, { useContext } from 'react';

import { makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

// import Background from '../assets/landing-background';

import '../index.css';

// NOTE: maybe use relative units instead of pixels.
// can this result in better responsive UI?
const useStyles = makeStyles((theme) => ({
    root: {
        height: '100vh',
        overflowX: 'hidden',
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    gridContainer: {
        height: '100%',
    },
    header: {
        [theme.breakpoints.up('sm')]: {
            fontSize: '12rem',
            letterSpacing: '-10px',
        },
        [theme.breakpoints.down('xs')]: {
            fontSize: '5.5rem',
            letterSpacing: '-5px',
        },
    },
    bottomHeaderOffset: {
        position: 'relative',
        [theme.breakpoints.up('sm')]: {
            bottom: '80px',
        },
        [theme.breakpoints.down('xs')]: {
            bottom: '35px',
        },
    },
    caption: {
        fontFamily: 'Agrandir',
        position: 'relative',
        [theme.breakpoints.up('sm')]: {
            // position for large screens
            fontSize: '1.4rem',
            bottom: '100px',
        },
        [theme.breakpoints.down('xs')]: {
            fontSize: '0.75rem',
            bottom: '25px',
        },
    },
    button: {
        backgroundColor: theme.palette.common.sekizkirkGrey,
        color: theme.palette.common.sekizkirkUltramarine,
        [theme.breakpoints.up('sm')]: {
            position: 'relative',
            bottom: '70px',
        },
    },
    // svgWrapper: {
    //     width: '120vmax',
    //     margin: '0',
    //     padding: '0',
    //     border: '0',
    //     // positioning absolute for using svg as background.
    //     // NOTE: better practice might exist here.
    //     position: 'absolute',
    // },
}));

const LandingPage = () => {
    const classes = useStyles();
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('xs'));

    const handleClick = () => {
        document.getElementById('main-page').scrollIntoView();
    };

    return (
        <article className={classes.root}>
            {/* <figure className={classes.svgWrapper}>
                {/* TODO: change this way importing of the svg with more proper practice */}
            {/* <Background /> */}
            {/* </figure> */}
            <Grid
                container
                direction="column"
                justify="center"
                alignItems="center"
                wrap="nowrap"
                className={classes.gridContainer}
            >
                <Grid item>
                    <Typography variant="h1" className={classes.header}>
                        sekiz
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography
                        variant="h1"
                        className={[classes.header, classes.bottomHeaderOffset]}
                    >
                        kırk
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography
                        color="primary"
                        variant="subtitle1"
                        className={classes.caption}
                    >
                        Proper scheduler for METU*
                    </Typography>
                </Grid>
                <Grid item>
                    <Button
                        variant="contained"
                        className={classes.button}
                        disableElevation
                        onClick={handleClick}
                        size={matches ? 'small' : 'medium'}
                    >
                        Get Started
                    </Button>
                </Grid>
            </Grid>
        </article>
    );
};

export default LandingPage;

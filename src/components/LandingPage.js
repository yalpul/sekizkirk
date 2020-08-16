import React, { useContext } from 'react';

import { makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import Background from '../assets/landing-background'

import '../index.css'


// NOTE: maybe use relative units instead of pixels.
// can this result in better responsive UI?
const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.common.black,
        height: '100vh',
        display: 'flex',
        color: theme.palette.common.white,
        justifyContent: 'center',
        alignItems: 'center',
        flexFlow: 'column wrap',
    },
    bottomOffset: {
        position: 'relative',
        bottom: '80px',
    },
    svgWrapper: {
        width: '120vmax',
        margin: '0',
        padding: '0',
        border: '0',
        // positioning absolute for using svg as background.
        // NOTE: better practice might exist here.
        position: 'absolute',
    },
    caption: {
        fontFamily: 'Agrandir',
        fontSize: '1.4rem',
        position: "relative",
        bottom: '70px'
    },
    button: {
        backgroundColor: theme.palette.common.sekizkirkGrey,
        color: theme.palette.common.sekizkirkUltramarine

    }
}))

const LandingPage = () => {
    const classes = useStyles();

    return (
        <article className={classes.root}>
            <figure className={classes.svgWrapper}>
                {/* TODO: change this way importing of the svg with more proper practice */}
                <Background />
            </figure>
            <Typography variant="h1" >
                sekiz
            </Typography>
            <Typography variant="h1" className={classes.bottomOffset}>
                kırk
            </Typography>
            <Typography color="primary" variant="subtitle1" className={classes.caption}>
                Proper scheduler for METU*
            </Typography>
            <Button variant="contained" className={classes.button} disableElevation component="a" href="#main-page">
                Get Started
            </Button>

        </article >
    )
};

export default LandingPage;

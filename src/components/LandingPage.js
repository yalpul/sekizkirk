import React, { useContext } from 'react';

import { makeStyles, Button } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

import DataContext from './DataContext';

import Background from '../assets/landing-background'

import '../index.css'


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
        </article >
    )
};

export default LandingPage;

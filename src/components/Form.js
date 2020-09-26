import React, { useContext } from 'react';
import DataContext from './DataContext';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
    mainContainer: {
        height: '100vh',
        backgroundColor: theme.palette.common.sekizkirkGrey,
    },
}));

const Form = () => {
    const data = useContext(DataContext);
    const classes = useStyles();

    console.log(data);

    return (
        <Grid
            container
            direction="column"
            className={classes.mainContainer}
            id="form-container"
        >
            <Grid item>Form</Grid>
        </Grid>
    );
};

export default Form;

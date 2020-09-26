import React, { useState, useContext } from "react";
import DataContext from "./DataContext";
import { makeStyles, useTheme } from "@material-ui/core/styles";

import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

const useStyles = makeStyles((theme) => ({
    mainContainer: {
        minHeight: "100vh",
        backgroundColor: theme.palette.common.sekizkirkGrey,
    },
}));

const Form = () => {
    const data = useContext(DataContext);
    const classes = useStyles();

    const [courseInput, setCourseInput] = useState("");

    return (
        <Grid
            container
            direction="column"
            className={classes.mainContainer}
            id="form-container"
            justify="center"
            alignItems="center"
        >
            <Grid item>
                <Autocomplete
                    options={data.courses}
                    open={courseInput.length > 2}
                    popupIcon={<></>} // no icon
                    onChange={() => setCourseInput("")}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Course Name"
                            variant="outlined"
                            onChange={(event) =>
                                setCourseInput(event.target.value)
                            }
                        />
                    )}
                    fullWidth
                    style={{ width: 500 }}
                />
            </Grid>
        </Grid>
    );
};

export default Form;

import React, { useState, useEffect, useContext } from "react";

import { DataContext } from "../DataContext";
import { CoursesContext, ADD_MUSTS } from "../CoursesContext";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import ListSubheader from "@material-ui/core/ListSubheader";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";

const useStyles = makeStyles((theme) => ({
    accordionContainer: {
        marginTop: "2em",
    },
    accordion: {
        backgroundColor: "inherit",
        border: `1px solid ${theme.palette.common.black}`,
        [theme.breakpoints.up("sm")]: {
            width: "35em",
        },
        [theme.breakpoints.down("xs")]: {
            width: "20em",
        },
    },
    accordionSummary: {
        "& .MuiAccordionSummary-content": {
            alignItems: "center",
            flexGrow: 0,
        },
    },
    deptSelect: {
        [theme.breakpoints.down("xs")]: {
            marginBottom: theme.spacing(2),
        },
    },
    mustSelect: {
        minWidth: "200px",
    },
}));

const AddMusts = ({ dept, setDept }) => {
    const classes = useStyles();
    const { departments, musts } = useContext(DataContext);
    const { dispatch } = useContext(CoursesContext);

    const [semester, setSemester] = useState("");

    const handleDepartmentChange = (event, value) => {
        setDept(value);
    };

    const handleSemesterChange = (event) => {
        setSemester(event.target.value);
    };

    useEffect(() => {
        // both inputs are selected
        if (dept !== null && semester !== "") {
            dispatch({ type: ADD_MUSTS, payload: { dept, semester } });
        }
    }, [dept, semester]);

    return (
        <Grid item className={classes.accordionContainer}>
            <Accordion className={classes.accordion}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    className={classes.accordionSummary}
                >
                    <Typography variant="body1">Add Must Courses</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container justify="space-around" alignItems="center">
                        <Grid item className={classes.deptSelect}>
                            <Autocomplete
                                options={departments.filter(
                                    // only show departments that have musts data avaliable.
                                    ({ code }) => musts[code] !== undefined
                                )}
                                getOptionLabel={(department) =>
                                    department.title
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Department"
                                        variant="outlined"
                                    />
                                )}
                                onChange={handleDepartmentChange}
                                popupIcon={<></>} // no icon
                                fullWidth
                                clearOnEscape
                                autoSelect
                                blurOnSelect
                                autoHighlight
                                noOptionsText="Not found."
                                value={dept}
                                className={classes.mustSelect}
                            />
                        </Grid>
                        <Grid item>
                            <FormControl
                                variant="outlined"
                                className={classes.mustSelect}
                            >
                                <InputLabel id="semester-select">
                                    Semester
                                </InputLabel>
                                <Select
                                    labelId="semester-select"
                                    value={semester}
                                    onChange={handleSemesterChange}
                                    label="semester"
                                >
                                    <ListSubheader
                                        style={{
                                            fontWeight: 700,
                                            pointerEvents: "none",
                                        }}
                                    >
                                        Fall
                                    </ListSubheader>
                                    {[1, 3, 5, 7].map((sem) => (
                                        <MenuItem key={sem} value={sem}>
                                            {sem}
                                        </MenuItem>
                                    ))}
                                    <ListSubheader
                                        style={{
                                            fontWeight: 700,
                                            pointerEvents: "none",
                                        }}
                                    >
                                        Spring
                                    </ListSubheader>
                                    {[2, 4, 6, 8].map((sem) => (
                                        <MenuItem
                                            key={sem}
                                            value={sem}
                                            disabled
                                        >
                                            {sem}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion>
        </Grid>
    );
};

export default AddMusts;

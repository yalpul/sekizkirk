import React, { useContext } from "react";

import {
    CoursesContext,
    ADD_SELECTIVE,
    CANCEL_SELECTIVES,
} from "../CoursesContext";

import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import CancelIcon from "@material-ui/icons/Cancel";

const useStyles = makeStyles((theme) => ({
    selectiveContainer: {
        width: "100%",
        maxWidth: "35em",
        marginTop: "1em",
        backgroundColor: theme.palette.common.listBackground,
    },
    selectiveHeader: {
        fontWeight: 700,
        fontFamily: "Agrandir",
        paddingLeft: theme.spacing(2),
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
    },
    listItem: {
        "&:hover .list-icon": {
            color: theme.palette.primary.dark,
        },
    },
}));

const SelectiveList = () => {
    const classes = useStyles();
    const { coursesState, dispatch } = useContext(CoursesContext);
    const { selectiveCourses } = coursesState;

    const handleSelectiveClick = (course, listIndex) => {
        dispatch({ type: ADD_SELECTIVE, payload: { course, listIndex } });
    };

    const handleCancelClick = () => {
        dispatch({ type: CANCEL_SELECTIVES });
    };

    return (
        selectiveCourses.length > 0 && (
            <Grid item className={classes.selectiveContainer}>
                <Grid container justify="space-between" wrap="nowrap">
                    <Grid item>
                        <Typography
                            variant="subtitle1"
                            className={classes.selectiveHeader}
                            color="secondary"
                        >
                            Selectives for this semester
                        </Typography>
                    </Grid>

                    <Grid item>
                        <IconButton onClick={handleCancelClick}>
                            <CancelIcon />
                        </IconButton>
                    </Grid>
                </Grid>
                <Divider />
                {selectiveCourses.map((selectiveList, listIndex) => {
                    return (
                        <List
                            dense
                            key={JSON.stringify(selectiveList)}
                            style={{
                                marginTop: listIndex !== 0 ? "1em" : undefined,
                            }}
                        >
                            {selectiveList.map((course) => (
                                <ListItem
                                    key={`${course.title}+${course.code}`}
                                    button
                                    onClick={() =>
                                        handleSelectiveClick(course, listIndex)
                                    }
                                    className={classes.listItem}
                                >
                                    <ListItemIcon>
                                        <CheckCircleIcon className="list-icon" />
                                    </ListItemIcon>
                                    <ListItemText primary={course.title} />
                                </ListItem>
                            ))}
                        </List>
                    );
                })}
            </Grid>
        )
    );
};

export default SelectiveList;

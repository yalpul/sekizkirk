import React from "react";
import { fade } from "@material-ui/core/styles/colorManipulator";

import { makeStyles } from "@material-ui/core";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import IconButton from "@material-ui/core/IconButton";

const useStyles = makeStyles((theme) => ({
    toTop: {
        position: "absolute",
        bottom: "2%",
        right: "2%",
        backgroundColor: theme.palette.secondary.light,
        color: "#fff",
        "&:hover": {
            backgroundColor: fade(theme.palette.secondary.light, 0.85),
        },
    },
}));

const ScrollTop = () => {
    const classes = useStyles();

    const handleClick = () => {
        document.getElementById("form-container").scrollIntoView();
    };

    return (
        <>
            {
                <IconButton
                    onClick={handleClick}
                    className={classes.toTop}
                    aria-label="to top"
                >
                    <ExpandLessIcon />
                </IconButton>
            }
        </>
    );
};

export default ScrollTop;

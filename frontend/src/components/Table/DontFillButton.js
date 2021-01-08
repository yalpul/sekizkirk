import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import NotInterestedIcon from "@material-ui/icons/NotInterested";

const useStyles = makeStyles(() => ({
    cellButton: {
        borderRadius: 5,
        padding: 0,
        height: "3.5em",
        width: "95%",
    },
}));

export default function DontFillButton({
    handleCellClick,
    hourIndex,
    dayIndex,
    isFavsActive,
    dontFill,
}) {
    const classes = useStyles();

    return (
        <Button
            className={classes.cellButton}
            onClick={() => handleCellClick(hourIndex, dayIndex)}
            disabled={isFavsActive}
            disableRipple
            style={{
                backgroundColor: dontFill && !isFavsActive ? "#000" : undefined,
                color: dontFill && !isFavsActive ? "#b80f0a" : "#FFF",
            }}
            startIcon={
                dontFill && !isFavsActive ? <NotInterestedIcon /> : undefined
            }
        >
            {dontFill && !isFavsActive ? "Don't Fill" : undefined}
        </Button>
    );
}

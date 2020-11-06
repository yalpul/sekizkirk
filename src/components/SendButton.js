import React from "react";

import { makeStyles } from "@material-ui/core/styles";

import Button from "@material-ui/core/Button";
import SendIcon from "@material-ui/icons/Send";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    button: {
        position: "absolute",
        left: 0,
        borderRadius: 50,
        color: "#FFF",
        backgroundColor: theme.palette.primary.main,
        marginLeft: "2em",
        "&:hover": {
            backgroundColor: theme.palette.primary.light,
        },
    },
}));

export default function SendButton() {
    const classes = useStyles();

    return (
        <Button
            variant="contained"
            endIcon={<SendIcon />}
            className={classes.button}
            size="small"
        >
            <Typography
                variant="body1"
                style={{ fontFamily: "Agrandir", marginTop: "3px" }}
                align="center"
            >
                Send
            </Typography>
        </Button>
    );
}

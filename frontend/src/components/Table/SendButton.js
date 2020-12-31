import React, { useState, useEffect, useReducer } from "react";
import axios from "axios";

import { makeStyles, useTheme } from "@material-ui/core/styles";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import SendIcon from "@material-ui/icons/Send";
import IconButton from "@material-ui/core/IconButton";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Tooltip from "@material-ui/core/Tooltip";
import DialogContentText from "@material-ui/core/DialogContentText";
import Typography from "@material-ui/core/Typography";
import InfoIcon from "@material-ui/icons/Info";
import LinearProgress from "@material-ui/core/LinearProgress";
import Alert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";

const useStyles = makeStyles((theme) => ({
    button: {
        position: "absolute",
        left: 0,
        borderRadius: 50,
        color: "#FFF",
        backgroundColor: theme.palette.primary.main,
        marginLeft: "2em",
        [theme.breakpoints.down("xs")]: {
            marginLeft: "1em",
        },
        "&:hover": {
            backgroundColor: theme.palette.primary.light,
        },
    },
    sendIcon: {
        backgroundColor: theme.palette.primary.main,
        color: "#FFF",
        opacity: 0.8,
        "&:hover": {
            backgroundColor: theme.palette.primary.light,
        },
    },
}));

// initial statae
const initState = {
    // only one of the sending and alertOpen
    // can be true at the same time
    dialogOpen: false,
    sending: false,
    alertOpen: false,
    message: "",
    severity: "",
};

// actions
const OPEN_DIALOG = "OPEN_DIALOG";
const CLOSE_DIALOG = "CLOSE_DIALOG";
const SENDING = "SENDING";
const CLOSE_ALERT = "CLOSE_ALERT";
const DISPLAY_SUCCESS = "DISPLAY_ALERT";
const DISPLAY_FAILURE = "DISPLAY_FAILURE";

const reducer = (state, action) => {
    if (action.type === OPEN_DIALOG) {
        return {
            ...initState,
            dialogOpen: true,
        };
    }

    if (action.type === CLOSE_DIALOG) {
        return {
            ...initState,
            dialogOpen: false,
        };
    }

    if (action.type === SENDING) {
        return {
            ...initState,
            dialogOpen: true,
            sending: true,
        };
    }

    if (action.type === CLOSE_ALERT) {
        return initState;
    }

    if (action.type === DISPLAY_SUCCESS) {
        const { message } = action.payload;

        return {
            dialogOpen: false, // close the dialog when feedback given
            sending: true, // prevents quick popup of dialog when before closing it.
            alertOpen: true,
            message,
            severity: "success",
        };
    }

    if (action.type === DISPLAY_FAILURE) {
        const { message } = action.payload;
        return {
            dialogOpen: false, // close the dialog when feedback given
            sending: true, // prevents quick popup of dialog when before closing it.
            alertOpen: true,
            message,
            severity: "error",
        };
    }

    return state;
};

export default function SendButton({ schedule }) {
    const classes = useStyles();
    const theme = useTheme();

    const [validEmail, setValidEmail] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [email, setEmail] = useState("");
    const [notify, setNotify] = useState(false);

    const [
        { dialogOpen, sending, alertOpen, message, severity },
        dispatch,
    ] = useReducer(reducer, initState);

    const handleMailSend = () => {
        const test_url = "/email/";

        // Format schedule load for backend processing
        const load = {};
        schedule.forEach((courseInfo) => {
            const [course, sectionId] = courseInfo;
            const { code } = course;

            load[code] = sectionId;
        });

        dispatch({ type: SENDING });

        axios
            .post(test_url, {
                email,
                schedule: load,
                notify,
            })
            .then((response) => {
                dispatch({
                    type: DISPLAY_SUCCESS,
                    payload: { message: "Email send succesfully." },
                });
            })
            .catch((error) => {
                if (error.response === undefined) {
                    // error occured while sending the request
                    dispatch({
                        type: DISPLAY_FAILURE,
                        payload: {
                            message:
                                "Connection couldn't be established with the email server. Please try again later.",
                        },
                    });
                } else {
                    // error occured on the server
                    dispatch({
                        type: DISPLAY_FAILURE,
                        payload: {
                            message:
                                " An error occurred on the server while sending the email. Please try again later. ",
                        },
                    });
                }
            });
    };

    const handleAlertClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        dispatch({ type: CLOSE_ALERT });
    };

    useEffect(() => {
        const re = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
        const isValid = re.test(email);
        setValidEmail(isValid);
    }, [email]);

    const showError = !isFocused && !validEmail && email !== "";

    return (
        <>
            <Button
                variant="contained"
                endIcon={<SendIcon />}
                className={classes.button}
                size="small"
                onClick={() => dispatch({ type: OPEN_DIALOG })}
            >
                <Typography
                    variant="body1"
                    style={{ fontFamily: "Agrandir", marginTop: "3px" }}
                    align="center"
                >
                    Send
                </Typography>
            </Button>

            <Dialog
                open={dialogOpen}
                onClose={() => dispatch({ type: CLOSE_DIALOG })}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle
                    id="form-dialog-title"
                    style={{ paddingBottom: 0, whiteSpace: "nowrap" }}
                >
                    Get Your Schedule
                </DialogTitle>
                <DialogContent>
                    {sending ? (
                        <LinearProgress />
                    ) : (
                        <Grid container direction="column" align="center">
                            <Grid
                                item
                                style={{
                                    marginTop: "-1em",
                                    marginBottom: "2em",
                                    alignSelf: "start",
                                }}
                            >
                                <DialogContentText>
                                    We can send your schedule via email.
                                </DialogContentText>
                            </Grid>

                            <Grid
                                item
                                container
                                align="center"
                                justify="center"
                                wrap="nowrap"
                            >
                                <Grid item>
                                    <TextField
                                        variant="outlined"
                                        label="your email"
                                        type="email"
                                        error={showError}
                                        helperText={
                                            showError
                                                ? "enter a valid email adress"
                                                : ""
                                        }
                                        value={email}
                                        onChange={(event) =>
                                            setEmail(event.target.value)
                                        }
                                        onFocus={() => setIsFocused(true)}
                                        onBlur={() => setIsFocused(false)}
                                    />
                                </Grid>

                                <Grid
                                    item
                                    style={{
                                        marginTop: "0.25em",
                                        marginLeft: "1em",
                                    }}
                                >
                                    <IconButton
                                        className={classes.sendIcon}
                                        disabled={!validEmail}
                                        onClick={handleMailSend}
                                    >
                                        <SendIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>

                            <Grid item>
                                <Grid
                                    container
                                    alignItems="center"
                                    wrap="nowrap"
                                >
                                    <Grid item>
                                        <FormControlLabel
                                            style={{ marginTop: "2em" }}
                                            control={
                                                <Checkbox
                                                    checked={notify}
                                                    onChange={(event) =>
                                                        setNotify(
                                                            event.target.checked
                                                        )
                                                    }
                                                    name="notify notify"
                                                    color="primary"
                                                />
                                            }
                                            label="Notify me upon changes in my course hours."
                                        />
                                    </Grid>

                                    <Grid
                                        item
                                        style={{
                                            marginTop: "35px",
                                        }}
                                    >
                                        <Tooltip
                                            title="Schedule changes in registration weeks are unfortunate but possible.
                                        We'll inform you about the updates.
                                        "
                                            arrow
                                        >
                                            <InfoIcon
                                                style={{
                                                    color:
                                                        theme.palette.secondary
                                                            .light,
                                                }}
                                            />
                                        </Tooltip>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions>
                    {!sending && (
                        <Button
                            onClick={() => dispatch({ type: CLOSE_DIALOG })}
                        >
                            cancel
                        </Button>
                    )}
                </DialogActions>
            </Dialog>

            <Snackbar
                open={alertOpen}
                autoHideDuration={5000}
                onClose={handleAlertClose}
            >
                <Alert
                    onClose={handleAlertClose}
                    severity={severity}
                    variant="filled"
                >
                    {message}
                </Alert>
            </Snackbar>
        </>
    );
}

import React, { useState, useEffect } from "react";
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

export default function SendButton({ schedule }) {
    const classes = useStyles();
    const theme = useTheme();

    const [open, setOpen] = useState(false);
    const [validEmail, setValidEmail] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [email, setEmail] = useState("");

    const [notify, setNotify] = useState(false);
    const [sending, setSending] = useState(false);
    const [alert, setAlert] = useState({
        open: false,
        message: "",
        severity: "",
    });

    const handleMailSend = () => {
        setSending(true);

        const test_url = "/email/";

        // Format schedule load for backend processing
        const load = {};
        schedule.forEach((courseInfo) => {
            const [course, sectionId] = courseInfo;
            const { code } = course;

            load[code] = sectionId;
        });

        let message, severity;
        axios
            .post(test_url, {
                email,
                schedule: load,
                notify,
            })
            .then((response) => {
                message = "Email sent succesfully.";
                severity = "success";
            })
            .catch((error) => {
                if (error.response === undefined) {
                    // error occured while sending the request
                    message =
                        "Connection couldn't be established with the email server. Please try again later.";
                    severity = "error";
                } else {
                    // error occured on the server
                    (message =
                        "An error occurred on the server while sending the email. Please try again later."),
                        (severity = "error");
                }
            })
            .finally(() => {
                setAlert({
                    open: true,
                    message,
                    severity,
                });

                setOpen(false);
                setSending(false);
            });
    };

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setAlert({ open: false, message: "" });
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
                onClick={() => setOpen(true)}
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
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle
                    id="form-dialog-title"
                    style={{ paddingBottom: 0 }}
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
                                <Grid container alignItems="center">
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
                        <Button onClick={() => setOpen(false)}>cancel</Button>
                    )}
                </DialogActions>
            </Dialog>
            <Snackbar
                open={alert.open}
                autoHideDuration={5000}
                onClose={handleClose}
            >
                <Alert
                    onClose={handleClose}
                    severity={alert.severity}
                    variant="filled"
                >
                    {alert.message}
                </Alert>
            </Snackbar>
        </>
    );
}

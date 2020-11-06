import React, { useState } from "react";

import { makeStyles } from "@material-ui/core/styles";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import SendIcon from "@material-ui/icons/Send";
import IconButton from "@material-ui/core/IconButton";
import { DialogContentText, Typography } from "@material-ui/core";

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

export default function SendButton() {
    const classes = useStyles();

    const [open, setOpen] = useState(false);

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
                    <Grid container direction="column" align="center">
                        <Grid
                            item
                            style={{ marginTop: "-1em", marginBottom: "2em" }}
                        >
                            <DialogContentText>
                                We can send your schedule via e-mail, or you can
                                dowload it.
                            </DialogContentText>
                        </Grid>

                        <Grid item container align="center" justify="center">
                            <Grid item>
                                <TextField
                                    variant="outlined"
                                    label="your email"
                                    tyle="email"
                                />
                            </Grid>

                            <Grid
                                item
                                style={{
                                    marginTop: "0.25em",
                                    marginLeft: "1em",
                                }}
                            >
                                <IconButton className={classes.sendIcon}>
                                    <SendIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>cancel</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

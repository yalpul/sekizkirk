import React, { useState } from "react";

import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import NotInterestedIcon from "@material-ui/icons/NotInterested";
import LabelIcon from "@material-ui/icons/Label";

export default function CourseDisplay({ name, bg }) {
    const [isMouseOver, setIsMouseOver] = useState(false);

    return (
        <Grid
            container
            key={name}
            style={{
                backgroundColor: bg,
                color: "#FFF",
                height: "3.5em",
                borderRadius: 5,
                width: "95%",
            }}
            alignItems="center"
            justify="center"
            onMouseOver={() => setIsMouseOver(true)}
            onMouseOut={() => setIsMouseOver(false)}
            onFocus={() => setIsMouseOver(true)}
            onBlur={() => setIsMouseOver(false)}
        >
            <Grid
                item
                xs={2}
                style={{
                    paddingLeft: "10px",
                    display: isMouseOver ? "flex" : "none",
                }}
            >
                <IconButton style={{ color: "inherit", padding: 0 }}>
                    <NotInterestedIcon fontSize="small" />
                </IconButton>
            </Grid>

            <Grid item xs={8}>
                <Typography variant="body1" align="center">
                    {name}
                </Typography>
            </Grid>

            <Grid
                item
                xs={2}
                style={{ display: isMouseOver ? "flex" : "none" }}
            >
                <IconButton
                    style={{
                        color: "inherit",
                        padding: 0,
                    }}
                >
                    <LabelIcon fontSize="small" />
                </IconButton>
            </Grid>
        </Grid>
    );
}

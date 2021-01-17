import React, { useState, useEffect, useContext } from "react";

import { CoursesContext, FIX_SECTION, UNFIX_SECTION } from "../CoursesContext";

import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import NotInterestedIcon from "@material-ui/icons/NotInterested";
import LockIcon from "@material-ui/icons/Lock";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import Tooltip from "@material-ui/core/Tooltip";

export default function CourseDisplay({ day, dontFillHandler, isFavsActive }) {
    const theme = useTheme();
    const matchSM = useMediaQuery(theme.breakpoints.down("sm"));

    if (day.length === 1) {
        // no collisions
        var collision = false;
        var [{ courseCode, sectionID, bg }] = day;
    } else {
        // collision
        collision = true;
    }

    const {
        coursesState: { fixedSections },
        dispatch,
    } = useContext(CoursesContext);

    const [isMouseOver, setIsMouseOver] = useState(false);
    const [isFixed, setIsFixed] = useState(false);

    const handleFix = () => {
        dispatch({ type: FIX_SECTION, payload: { courseCode, sectionID } });
    };

    const handleUnfix = () => {
        dispatch({ type: UNFIX_SECTION, payload: { courseCode } });
    };

    useEffect(() => {
        if (
            fixedSections[courseCode] &&
            sectionID === fixedSections[courseCode].fixedSection
        ) {
            setIsFixed(true);
        } else {
            setIsFixed(false);
        }
    }, [fixedSections]);

    return (
        <Grid
            container
            style={{
                backgroundColor: !collision ? bg : undefined,
                backgroundImage: collision
                    ? `linear-gradient(45deg, #b80f0a 28.57%, #000000 28.57%, #000000 50%, #b80f0a 50%, #b80f0a 78.57%, #000000 78.57%, #000000 100%)`
                    : undefined,
                backgroundSize: collision ? "49.50px 49.50px" : undefined,
                color: "#FFF",
                minHeight: "3.5em",
                height: "100%",
                borderRadius: 5,
                width: "98%",
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
                md={2}
                xs={6}
                style={{
                    paddingLeft: collision ? undefined : "10px",
                    visibility:
                        isFavsActive || isFixed || !isMouseOver
                            ? "hidden"
                            : undefined,
                    display:
                        matchSM && (isFavsActive || isFixed || !isMouseOver)
                            ? "none"
                            : undefined,
                }}
            >
                <Tooltip title="don't fill" arrow>
                    <IconButton
                        style={{ color: "inherit", padding: 0 }}
                        onClick={dontFillHandler}
                    >
                        <NotInterestedIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Grid>

            <Grid
                item
                md={8}
                xs={12}
                style={{
                    display:
                        matchSM && isMouseOver && !isFixed && !isFavsActive
                            ? "none"
                            : undefined,
                }}
            >
                {day.map(({ name, classroom }, index) => (
                    <>
                        <Typography
                            variant="body1"
                            align="center"
                            key={`${name}-${index}`}
                        >
                            {name}
                            <br />
                            {classroom ? classroom : null}
                        </Typography>
                    </>
                ))}
            </Grid>

            <Grid
                item
                md={2}
                xs={6}
                style={{
                    visibility:
                        collision || isFavsActive || (!isFixed && !isMouseOver)
                            ? "hidden"
                            : undefined,
                    display:
                        matchSM &&
                        (collision ||
                            isFavsActive ||
                            (!isFixed && !isMouseOver))
                            ? "none"
                            : undefined,
                }}
            >
                {!isFixed ? (
                    <Tooltip title="fix section" arrow>
                        <IconButton
                            style={{
                                color: "inherit",
                                padding: 0,
                            }}
                            onClick={handleFix}
                        >
                            <LockOpenIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                ) : (
                    <Tooltip title="unfix" arrow>
                        <IconButton
                            style={{
                                color: "inherit",
                                padding: 0,
                            }}
                            onClick={handleUnfix}
                        >
                            <LockIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                )}
            </Grid>
        </Grid>
    );
}

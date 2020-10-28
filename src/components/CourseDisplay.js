import React, { useState, useEffect } from "react";

import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import NotInterestedIcon from "@material-ui/icons/NotInterested";
import LabelIcon from "@material-ui/icons/Label";
import LabelOffIcon from "@material-ui/icons/LabelOff";
import Tooltip from "@material-ui/core/Tooltip";

export default function CourseDisplay({
    name,
    bg,
    dontFillHandler,
    courseCode,
    sectionID,
    fixedSections,
    setFixedSections,
    sectionChecks,
    setSectionChecks,
}) {
    const [isMouseOver, setIsMouseOver] = useState(false);
    const [isFixed, setIsFixed] = useState(false);

    const handleFix = () => {
        setFixedSections({
            ...fixedSections,
            [courseCode]: {
                fixedSection: sectionID,
                prevChecks: sectionChecks[courseCode],
            },
        });

        // only check the course's fixed section as true,
        // uncheck the remaining
        setSectionChecks({
            ...sectionChecks,
            [courseCode]: sectionChecks[courseCode].map(
                (_, index) => sectionID === index
            ),
        });
    };

    const handleUnfix = () => {
        setFixedSections({ ...fixedSections, [courseCode]: undefined });

        // load the previosly selected sections for the courses
        setSectionChecks({
            ...sectionChecks,
            [courseCode]: fixedSections[courseCode].prevChecks,
        });
    };

    useEffect(() => {
        try {
            // fix other nodes on the table of the same sections as well
            if (sectionID === fixedSections[courseCode].fixedSection) {
                setIsFixed(true);
            }
        } catch (e) {
            // unfix all the nodes of the section
            if (isFixed) {
                setIsFixed(false);
            }
        }
    }, [fixedSections]);

    return (
        <Grid
            container
            key={name}
            style={{
                backgroundColor: bg,
                color: "#FFF",
                height: "3.5em",
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
                xs={2}
                style={{
                    paddingLeft: "10px",
                    display: isMouseOver ? "flex" : "none",
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
                {!isFixed ? (
                    <Tooltip title="fix section" arrow>
                        <IconButton
                            style={{
                                color: "inherit",
                                padding: 0,
                            }}
                            onClick={handleFix}
                        >
                            <LabelIcon fontSize="small" />
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
                            <LabelOffIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                )}
            </Grid>
        </Grid>
    );
}

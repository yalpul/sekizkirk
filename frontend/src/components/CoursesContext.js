import React, { createContext, useReducer, useContext } from "react";

import { DataContext } from "./DataContext";

const initialState = {
    manualCourses: [],
    mustCourses: [],
    uniqueCourses: [],
    selectiveCourses: [],
    electiveCourses: [],
    sectionChecks: {},
    allowCollision: {},
    fixedSections: {},
};

// available action types in this reducer
export const ADD_COURSE = "ADD_COURSE";
export const ADD_MUSTS = "ADD_MUSTS";
export const DELETE_COURSE = "DELETE_COURSE";
export const DELETE_ALL = "DELETE_ALL";
export const ELECTIVE_SELECT = "ELECTIVE_SELECT";
export const ADD_SELECTIVE = "ADD_SELECTIVE";
export const UNSELECT_ALL_SECTIONS = "UNSELECT_ALL_SECTIONS";
export const TOGGLE_CHECK = "TOGGLE_CHECK";
export const TOGGLE_COLLISION = "TOGGLE_COLLISION";
export const CANCEL_SELECTIVES = "CANCEL_SELECTIVES";
export const FIX_SECTION = "FIX_SECTION";
export const UNFIX_SECTION = "UNFIX_SECTION";
export const TOGGLE_INSTRUCTOR = "TOGGLE_INSTRUCTOR";

export const CoursesContext = createContext({});

export const CoursesProvider = ({ children }) => {
    const { courseSlots, musts, courses } = useContext(DataContext);

    // NOTE: can't put the reducer function out of the component because
    // it uses `useContext` hook.
    const reducer = (state, action) => {
        if (action.type === ADD_COURSE) {
            const {
                manualCourses,
                mustCourses,
                uniqueCourses,
                sectionChecks,
                allowCollision,
            } = state;
            const { course } = action.payload;

            // if course already included in the courses don't modify the state
            if (course === null || uniqueCourses.includes(course)) return state;

            const sections = courseSlots[course.code];
            const newManuals = [course, ...manualCourses];

            return {
                ...state,
                sectionChecks: {
                    ...sectionChecks,
                    [course.code]: sections.map(() => true), // select by default all sections for this course
                },
                allowCollision: {
                    ...allowCollision,
                    [course.code]: false, // don't allow collisions by default
                },
                manualCourses: newManuals,
                uniqueCourses: [...new Set([...mustCourses, ...newManuals])],
            };
        }

        if (action.type === ADD_MUSTS) {
            const { sectionChecks, allowCollision, manualCourses } = state;
            const { dept, semester } = action.payload;

            // see the musts.json for structure of the data
            const [mustCodes, selectiveCodes, electiveTypes] = musts[dept.code][
                semester - 1
            ];

            // some must codes doesn't included in courses data,
            // filter them.
            const filteredMusts = mustCodes.filter(
                (code) => courses[code] !== undefined
            );

            // add sections checks and allow collision for must courses
            const sectionsForMusts = {};
            const collisionForMusts = {};
            filteredMusts.forEach((code) => {
                const sections = courseSlots[code];
                sectionsForMusts[code] = sections.map(() => true);
                collisionForMusts[code] = false;
            });

            const newMustCourses = filteredMusts.map((code) => courses[code]);

            // TODO: should we delete the sectionChecks and allowChecks for the
            // must courses that are not used.
            return {
                ...state,
                mustCourses: newMustCourses,
                uniqueCourses: [
                    ...new Set([...newMustCourses, ...manualCourses]),
                ],
                selectiveCourses: selectiveCodes.map((code) => courses[code]),
                electiveCourses: [...electiveTypes],
                sectionChecks: { ...sectionsForMusts, ...sectionChecks },
                allowCollision: {
                    ...collisionForMusts,
                    ...allowCollision,
                },
            };
        }

        if (action.type === DELETE_COURSE) {
            const { mustCourses, manualCourses } = state;
            const { course } = action.payload;

            // same course might be included in both manual courses and must courses.
            // delete it from both.
            const newMustCourses = mustCourses.filter(
                (mustCourse) => mustCourse !== course
            );
            const newManualCourses = manualCourses.filter(
                (manualCourse) => manualCourse !== course
            );

            return {
                ...state,
                mustCourses: newMustCourses,
                manualCourses: newManualCourses,
                uniqueCourses: [
                    ...new Set([...newMustCourses, ...newManualCourses]),
                ],
            };
        }

        if (action.type === DELETE_ALL) {
            return initialState;
        }

        if (action.type === ELECTIVE_SELECT) {
            const { electiveCourses } = state;
            const { index } = action.payload;

            // remove the elective select from the UI
            const temp = [...electiveCourses];
            temp.splice(index, 1);
            return {
                ...state,
                electiveCourses: temp,
            };
        }

        if (action.type === ADD_SELECTIVE) {
            const {
                mustCourses,
                sectionChecks,
                allowCollision,
                manualCourses,
            } = state;
            const { course } = action.payload;

            const sections = courseSlots[course.code];

            // add selected course to the musts,
            // clear selectiveCourses
            const newMustCourses = [...mustCourses, course];
            return {
                ...state,
                mustCourses: newMustCourses,
                uniqueCourses: [
                    ...new Set([...newMustCourses, ...manualCourses]),
                ],
                selectiveCourses: [],
                sectionChecks: {
                    ...sectionChecks,
                    [course.code]: sections.map(() => true), // select by default all sections for this course
                },
                allowCollision: {
                    ...allowCollision,
                    [course.code]: false, // don't allow collisions by default
                },
            };
        }

        if (action.type === UNSELECT_ALL_SECTIONS) {
            const { sectionChecks } = state;
            const { course } = action.payload;

            return {
                ...state,
                sectionChecks: {
                    ...sectionChecks,
                    // unchecked all the sections for given course
                    [course.code]: sectionChecks[course.code].map(() => false),
                },
            };
        }

        if (action.type === TOGGLE_CHECK) {
            const { course, index } = action.payload;
            const { sectionChecks } = state;

            const temp = [...sectionChecks[course.code]];
            temp[index] = !temp[index];
            return {
                ...state,
                sectionChecks: { ...sectionChecks, [course.code]: temp },
            };
        }

        if (action.type === TOGGLE_COLLISION) {
            const { course } = action.payload;
            const { allowCollision } = state;

            return {
                ...state,
                allowCollision: {
                    ...allowCollision,
                    [course.code]: !allowCollision[course.code],
                },
            };
        }

        if (action.type === CANCEL_SELECTIVES) {
            return {
                ...state,
                selectiveCourses: [],
            };
        }

        if (action.type === FIX_SECTION) {
            const { courseCode, sectionID } = action.payload;
            const { sectionChecks, fixedSections } = state;

            return {
                ...state,
                // cache previously selected checks,
                // they are displayed exactly same when user unfixes section
                fixedSections: {
                    ...fixedSections,
                    [courseCode]: {
                        fixedSection: sectionID,
                        prevChecks: [...sectionChecks[courseCode]],
                    },
                },
                // only check the course's fixed section as true,
                // uncheck the remaining
                sectionChecks: {
                    ...sectionChecks,
                    [courseCode]: sectionChecks[courseCode].map(
                        (_, index) => sectionID === index
                    ),
                },
            };
        }

        if (action.type === UNFIX_SECTION) {
            const { courseCode } = action.payload;
            const { sectionChecks, fixedSections } = state;

            return {
                ...state,
                fixedSections: {
                    ...fixedSections,
                    [courseCode]: undefined,
                },
                sectionChecks: {
                    ...sectionChecks,
                    [courseCode]: fixedSections[courseCode].prevChecks,
                },
            };
        }

        if (action.type === TOGGLE_INSTRUCTOR) {
            const { courseCode, instructorSections, isActive } = action.payload;
            const { sectionChecks } = state;

            const temp = [...sectionChecks[courseCode]];
            instructorSections.forEach((sectionId) => {
                temp[sectionId] = isActive;
            });

            return {
                ...state,
                sectionChecks: {
                    ...sectionChecks,
                    [courseCode]: temp,
                },
            };
        }

        return state;
    };

    const [coursesState, dispatch] = useReducer(reducer, initialState);
    return (
        <CoursesContext.Provider value={{ coursesState, dispatch }}>
            {children}
        </CoursesContext.Provider>
    );
};
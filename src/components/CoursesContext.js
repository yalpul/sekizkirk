import React, { createContext, useReducer, useContext } from "react";

import { DataContext } from "./DataContext";

const initialState = {
    manualCourses: [],
    mustCourses: [],
    selectiveCourses: [],
    electiveCourses: [],
    sectionChecks: {},
    allowCollision: {},
};

// available action types in this reducer
export const ADD_COURSE = "ADD_COURSE";
export const ADD_MUSTS = "ADD_MUSTS";
export const DELETE_COURSE = "DELETE_COURSE";
export const DELETE_ALL = "DELETE_ALL";
export const ELECTIVE_SELECT = "ELECTIVE_SELECT";

export const CoursesContext = createContext({});

export const CoursesProvider = ({ children }) => {
    const { courseSlots, musts, courses } = useContext(DataContext);

    // NOTE: can't put the reducer function out of the component because
    // it uses `useContext` hook.
    const reducer = (state, action) => {
        if (action.type === ADD_COURSE) {
            const { manualCourses, mustCourses } = state;
            const { course } = action.payload;

            // if course already included in the courses don't modify the state
            if (
                course === null ||
                manualCourses.includes(course) ||
                mustCourses.includes(course)
            )
                return state;

            const sections = courseSlots[course.code];

            return {
                ...state,
                sectionChecks: {
                    [course.code]: sections.map(() => true), // select by default all sections for this course
                    ...state.sectionChecks,
                },
                allowCollision: {
                    [course.code]: false, // don't allow collisions by default
                    ...state.allowCollision,
                },
                manualCourses: [course, ...state.manualCourses],
            };
        }

        if (action.type === ADD_MUSTS) {
            const { dept, semester } = action.payload;

            // see the musts.json for structure of the data
            const [mustCodes, selectiveCodes, electiveTypes] = musts[dept.code][
                semester - 1
            ];

            // add sections checks and allow collision for must courses
            const sectionsForMusts = {};
            const collisionForMusts = {};
            mustCodes.forEach((code) => {
                const sections = courseSlots[code];
                sectionsForMusts[code] = sections.map(() => true);
                collisionForMusts[code] = false;
            });

            // TODO: should we delete the sectionChecks and allowChecks for the
            // must courses that are not used.
            return {
                ...state,
                mustCourses: mustCodes.map((code) => courses[code]),
                selectiveCourses: selectiveCodes.map((code) => courses[code]),
                electiveCourses: [...electiveTypes],
                sectionChecks: { ...sectionsForMusts, ...state.sectionChecks },
                allowCollision: {
                    ...collisionForMusts,
                    ...state.allowCollision,
                },
            };
        }

        if (action.type === DELETE_COURSE) {
            const { course } = action.payload;

            // same course might be included in both manual courses and must courses.
            // delete it from both.
            return {
                ...state,
                mustCourses: state.mustCourses.filter(
                    (mustCourse) => mustCourse !== course
                ),
                manualCourses: state.manualCourses.filter(
                    (manualCourse) => manualCourse !== course
                ),
            };
        }

        if (action.type === DELETE_ALL) {
            return initialState;
        }

        if (action.type === ELECTIVE_SELECT) {
            const { index } = action.payload;

            // remove the elective select from the UI
            const temp = [...state.electiveCourses];
            temp.splice(index, 1);
            return {
                ...state,
                electiveCourses: temp,
            };
        }

        return state;
    };

    const [coursesState, dispatch] = useReducer(reducer, initialState);
    console.log(coursesState);
    return (
        <CoursesContext.Provider value={{ coursesState, dispatch }}>
            {children}
        </CoursesContext.Provider>
    );
};

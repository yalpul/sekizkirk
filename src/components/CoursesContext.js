import React, { createContext, useReducer, useContext } from "react";

import { DataContext } from "./DataContext";

const initialState = {
    manuelCourses: [],
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
export const DELETE_MUSTS = "DELETE_MUSTS";
export const DELETE_ALL = "DELETE_ALL";

export const CoursesContext = createContext({});

export const CoursesProvider = ({ children }) => {
    const { courseSlots, musts, courses } = useContext(DataContext);

    // NOTE: can't put the reducer function out of the component because
    // it uses `useContext` hook.
    const reducer = (state, action) => {
        if (action.type === ADD_COURSE) {
            const { manuelCourses, mustCourses } = state;
            const { courseValue } = action.payload;

            // if course already included in the courses don't modify the state
            if (
                courseValue === null ||
                manuelCourses.includes(courseValue) ||
                mustCourses.includes(courseValue)
            )
                return state;

            const sections = courseSlots[courseValue.code];

            return {
                ...state,
                sectionChecks: {
                    [courseValue.code]: sections.map(() => true), // select by default all sections for this course
                    ...state.sectionChecks,
                },
                allowCollision: {
                    [courseValue.code]: false, // don't allow collisions by default
                    ...state.allowCollision,
                },
                manuelCourses: [courseValue, ...state.manuelCourses],
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

        if (action.type === DELETE_MUSTS) {
            return {
                ...state,
                mustCourses: [],
                selectiveCourses: [],
                electiveCourses: [],
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

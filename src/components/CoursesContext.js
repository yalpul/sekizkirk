import React, { createContext, useReducer, useContext } from "react";

import { DataContext } from "./DataContext";

const initialState = {
    courses: [],
    manuelCourses: [],
    sectionChecks: {},
    allowCollision: {},
};

// available action types in this reducer
export const COURSE_ADD = "COURSE_ADD";
export const COURSE_DELETE = "COURSE_DELETE";
export const DELETE_ALL = "DELETE_ALL";

export const CoursesContext = createContext({});

export const CoursesProvider = ({ children }) => {
    const { courseSlots } = useContext(DataContext);

    // NOTE: can't put the reducer function out of the component because
    // it uses `useContext` hook.
    const reducer = (state, action) => {
        const { courses } = state;

        if (action.type === COURSE_ADD) {
            const { courseValue } = action.payload;

            // if course already included in the courses don't modify the state
            if (courseValue === null || courses.includes(courseValue))
                return state;

            const sections = courseSlots[courseValue.code];

            return {
                sectionChecks: {
                    [courseValue.code]: sections.map(() => true), // select by default all sections for this course
                    ...state.sectionChecks,
                },
                allowCollision: {
                    [courseValue.code]: false, // don't allow collisions by default
                    ...state.allowCollision,
                },
                courses: [courseValue, ...state.courses],
                manuelCourses: [courseValue, ...state.manuelCourses],
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

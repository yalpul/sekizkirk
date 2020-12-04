import React, { createContext, useEffect, useReducer } from "react";

import { days, hours } from "../constants";

const initialState = {
    possibleSchedules: [],
    favSchedules: JSON.parse(window.localStorage.getItem("favSchedules")) || {},
    dontFills: hours.map(() => days.map(() => false)),
};

// available action types in this reducer
export const UPDATE_POSSIBLE_SCHEDULES = "UPDATE_POSSIBLE_SCHEDULES";
export const DELETE_FROM_FAVS = "DELETE_FROM_FAVS";
export const ADD_TO_FAVS = "ADD_TO_FAVS";
export const TOGGLE_DONT_FILL = "TOGGLE_DONT_FILL";

export const DisplayContext = createContext({});

const reducer = (state, action) => {
    if (action.type === UPDATE_POSSIBLE_SCHEDULES) {
        const { schedules } = action.payload;
        return {
            ...state,
            possibleSchedules: schedules,
        };
    }

    if (action.type === DELETE_FROM_FAVS) {
        const { favSchedules } = state;
        const { hash } = action.payload;

        const temp = { ...favSchedules };
        delete temp[hash];

        return {
            ...state,
            favSchedules: temp,
        };
    }

    if (action.type === ADD_TO_FAVS) {
        const { favSchedules } = state;
        const { hash, schedule } = action.payload;

        return {
            ...state,
            favSchedules: { ...favSchedules, [hash]: schedule },
        };
    }

    if (action.type === TOGGLE_DONT_FILL) {
        const { dontFills } = state;
        const { hourIndex, dayIndex } = action.payload;

        const temp = [...dontFills];
        temp[hourIndex][dayIndex] = !temp[hourIndex][dayIndex];

        return {
            ...state,
            dontFills: temp,
        };
    }

    return state;
};

export const DisplayProvider = ({ children }) => {
    const [displayState, dispatch] = useReducer(reducer, initialState);
    const { favSchedules } = displayState;

    useEffect(() => {
        window.localStorage.setItem(
            "favSchedules",
            JSON.stringify(favSchedules)
        );
    }, [favSchedules]);

    return (
        <DisplayContext.Provider value={{ displayState, dispatch }}>
            {children}
        </DisplayContext.Provider>
    );
};

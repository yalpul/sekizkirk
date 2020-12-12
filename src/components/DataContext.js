import React, { useState, useEffect, createContext } from "react";

const data_url = "/data.json";

export const DataContext = createContext({});

export const DataProvider = ({ children }) => {
    const [data, setData] = useState({
        musts: {},
        courses: {},
        departments: [],
        courseSlots: {},
        lastUpdate: "",
    });

    useEffect(() => {
        fetch(data_url)
            .then((response) => response.json())
            .then((data) => setData(data));
    }, []);

    return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
};

import React from "react";
import { render } from "react-dom";

import { DataProvider } from "./components/DataContext";

import App from "./App";

render(
    <React.StrictMode>
        <DataProvider>
            <App />
        </DataProvider>
    </React.StrictMode>,
    document.getElementById("root")
);

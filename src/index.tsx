import React from "react";

import { StyledEngineProvider } from "@mui/material";
import ReactDOM from "react-dom";
import { createHashRouter, RouterProvider } from "react-router-dom";

import App from "./App";
import "./scss/index.scss";
import AppIcon from "./components/AppIcon";

const router = createHashRouter([
    {
        path: "/icon",
        element: <AppIcon />,
    },
    {
        path: "/*",
        element: <App />,
    },
]);

function Root() {
    return (
        <StyledEngineProvider injectFirst>
            <RouterProvider router={router}></RouterProvider>
        </StyledEngineProvider>
    );
}

const root = document.getElementById("root");

ReactDOM.render(<Root />, root);

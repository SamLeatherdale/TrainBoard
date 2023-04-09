import React from "react";

import { StyledEngineProvider, ThemeProvider } from "@mui/material";
import ReactDOM from "react-dom";
import { createHashRouter, RouterProvider } from "react-router-dom";

import App from "./App";
import "./scss/index.scss";
import AppIcon from "./components/AppIcon";
import { theme } from "./theme";

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

const root = document.getElementById("root");

ReactDOM.render(
    <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
            <RouterProvider router={router}></RouterProvider>
        </ThemeProvider>
    </StyledEngineProvider>,
    root
);

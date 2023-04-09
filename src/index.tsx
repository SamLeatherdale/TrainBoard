import React from "react";

import { StyledEngineProvider, ThemeProvider } from "@mui/material";
import ReactDOM from "react-dom";
import { createHashRouter, RouterProvider } from "react-router-dom";

import App from "./App";
import "./scss/index.scss";
import AppIcon from "./components/AppIcon";
import { theme } from "./theme";
import { initDpad } from "./util/dpad";

const router = createHashRouter([
    {
        path: "/*",
        element: <App />,
    },
]);

const root = document.getElementById("root");
if (window.location.href.includes("?icon")) {
    ReactDOM.render(<AppIcon />, root);
} else {
    initDpad();

    ReactDOM.render(
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <RouterProvider router={router}></RouterProvider>
            </ThemeProvider>
        </StyledEngineProvider>,
        root
    );
}

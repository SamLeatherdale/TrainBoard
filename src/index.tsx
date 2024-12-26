import React from "react";

import { StyledEngineProvider } from "@mui/material";
import { createRoot } from "react-dom/client";
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

const root = document.getElementById("root")!;

createRoot(root).render(<Root />);

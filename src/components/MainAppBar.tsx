import React, { ReactNode } from "react";

import { DarkMode, LightMode } from "@mui/icons-material";
import ExitIcon from "@mui/icons-material/ExitToApp";
import MenuIcon from "@mui/icons-material/Menu";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Box, PaletteMode, Typography } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";

import { getAndroid } from "../util/android";

import Clock from "./Clock";

export default function MainAppBar({
    openMenu,
    label,
    refreshTimer,
    theme,
    toggleTheme,
}: {
    openMenu: () => void;
    label: ReactNode;
    refreshTimer: ReactNode;
    theme: PaletteMode;
    toggleTheme: () => void;
}) {
    return (
        <AppBar position="static" id="main-appbar">
            <Toolbar>
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    onClick={openMenu}
                    size="large"
                >
                    <MenuIcon />
                </IconButton>
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    onClick={() =>
                        getAndroid() ? getAndroid()?.reload() : window.location.reload()
                    }
                    size="large"
                >
                    <RefreshIcon />
                </IconButton>
                <Typography variant={"h6"}>Train Board{label}</Typography>

                <Clock />
                <Box ml={1} />
                {refreshTimer}
                <IconButton sx={{ ml: 1 }} onClick={toggleTheme} color="inherit">
                    {theme === "dark" ? <LightMode /> : <DarkMode />}
                </IconButton>
                <IconButton
                    color="inherit"
                    onClick={() => {
                        getAndroid()
                            ? getAndroid()?.exit()
                            : (window.location.href = "https://transportnsw.info/trip");
                    }}
                    size="large"
                >
                    <ExitIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
}
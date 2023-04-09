import React, { ReactNode } from "react";

import ExitIcon from "@mui/icons-material/ExitToApp";
import MenuIcon from "@mui/icons-material/Menu";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Box, Typography } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";

import { getAndroid } from "../util/android";

import Clock from "./Clock";

export default function MainAppBar({
    openMenu,
    label,
    refreshTimer,
}: {
    openMenu: () => void;
    label: ReactNode;
    refreshTimer: ReactNode;
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

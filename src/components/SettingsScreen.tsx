import React, { FC } from "react";

import CloseIcon from "@mui/icons-material/Close";
import MapIcon from "@mui/icons-material/Map";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import { Tab, Tabs, Theme, useMediaQuery } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import MuiDialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { Route, Routes, useMatch, useNavigate } from "react-router-dom";

import SettingsSet from "../classes/SettingsSet";

import GeneralSettingsPane from "./SettingsPane/GeneralSettingsPane";
import MapsSettingsPane from "./SettingsPane/MapsSettingsPane";
import RemindersSettingsPane from "./SettingsPane/RemindersSettingsPane";
import { OnUpdateFunc, SettingsPane } from "./SettingsPane/SettingsPane";


const styles = (theme: Theme) =>
    createStyles({
        root: {
            margin: 0,
            padding: theme.spacing(2),
        },
        closeButton: {
            position: "absolute",
            right: theme.spacing(1),
            top: theme.spacing(1),
            color: theme.palette.grey[500],
        },
    });

const DialogTitle = withStyles(styles)((props: any) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle className={classes.root} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    className={classes.closeButton}
                    onClick={onClose}
                    size="large"
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

interface PaneConfig {
    key: SettingsPane;
    name: string;
    component: JSX.Element;
    icon: JSX.Element;
}

export interface SettingsScreenProps {
    settings: SettingsSet;
    menuOpen: boolean;
    onUpdate: OnUpdateFunc;
    onReset: () => void;
    onClose: () => void;
}

const SettingsScreen: FC<SettingsScreenProps> = (props) => {
    const navigate = useNavigate();
    const onClose = () => {
        props.onClose();
    };

    const { settings, onUpdate, onReset } = props;
    const paneProps = { settings, onUpdate, onReset };

    const panes: PaneConfig[] = [
        {
            key: SettingsPane.GENERAL,
            name: "General",
            component: <GeneralSettingsPane {...paneProps} />,
            icon: <SettingsIcon />,
        },
        {
            key: SettingsPane.MAPS,
            name: "Maps",
            component: <MapsSettingsPane {...paneProps} />,
            icon: <MapIcon />,
        },
        {
            key: SettingsPane.REMINDERS,
            name: "Reminders",
            component: <RemindersSettingsPane {...paneProps} />,
            icon: <NotificationsIcon />,
        },
    ];

    const activePane = useMatch("/settings/:pane")?.params["pane"];
    const currentPane = panes.findIndex((pane) => pane.key === activePane) || 0;
    const fullScreen = useMediaQuery("(max-height: 600px)");

    return (
        <Dialog id="settings-dialog" open={props.menuOpen} fullWidth={true} fullScreen={fullScreen}>
            <DialogTitle onClose={onClose}>Settings</DialogTitle>
            <Divider />
            <Tabs value={currentPane} variant="fullWidth">
                {panes.map((pane) => (
                    <Tab
                        key={pane.key}
                        onClick={() =>
                            navigate({ pathname: `/settings/${pane.key}` }, { replace: true })
                        }
                        icon={pane.icon}
                        label={pane.name}
                    />
                ))}
            </Tabs>
            <div className="dialog-main">
                <Routes>
                    {panes.map((pane) => (
                        <Route
                            key={pane.key}
                            path={pane.key}
                            element={<DialogContent>{pane.component}</DialogContent>}
                        />
                    ))}
                </Routes>
            </div>
        </Dialog>
    );
};

export default SettingsScreen;

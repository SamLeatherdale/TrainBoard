import {createStyles, Theme, withStyles} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import React from "react";
import SettingsSet from "../classes/SettingsSet";
import AutoBoundComponent from "./AutoBoundComponent";
import DeveloperSettingsPane from "./SettingsPane/DeveloperSettingsPane";
import GeneralSettingsPane from "./SettingsPane/GeneralSettingsPane";
import MapsSettingsPane from "./SettingsPane/MapsSettingsPane";
import RemindersSettingsPane from "./SettingsPane/RemindersSettingsPane";
import {OnUpdateFunc} from "./SettingsPane/SettingsPane";
import SettingsIcon from "@material-ui/icons/Settings";
import MapIcon from "@material-ui/icons/Map";
import NotificationsIcon from "@material-ui/icons/Notifications";
import CodeIcon from "@material-ui/icons/Code";

const styles = (theme: Theme) =>
    createStyles({
        root: {
            margin: 0,
            padding: theme.spacing(2),
        },
        closeButton: {
            position: 'absolute',
            right: theme.spacing(1),
            top: theme.spacing(1),
            color: theme.palette.grey[500],
        },
    });

const DialogTitle = withStyles(styles)((props:  any) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

enum SettingsPaneEnum {
    GENERAL = "General",
    MAPS = "Maps",
    REMINDERS = "Reminders",
    DEVELOPER = "Developer"
}

export interface SettingsScreenProps {
    settings: SettingsSet
    menuOpen: boolean
    onUpdate: OnUpdateFunc,
    onClose: () => void;
}

class SettingsScreenState {
    activePane = SettingsPaneEnum.GENERAL;
}

export default class SettingsScreen extends AutoBoundComponent<SettingsScreenProps, SettingsScreenState> {
    constructor(props) {
        super(props);

        this.state = new SettingsScreenState();
    }

    onClose() {
        this.props.onClose();
    }

    setActivePane(key: SettingsPaneEnum) {
        this.setState({activePane: key});
    }

    render() {
        const {settings, onUpdate} = this.props;
        const {activePane} = this.state;

        const paneProps = {settings, onUpdate};

        interface PaneConfig {
            key: SettingsPaneEnum,
            component: JSX.Element,
            icon: JSX.Element
        }
        const panes: PaneConfig[] = [{
            key: SettingsPaneEnum.GENERAL,
            component: <GeneralSettingsPane {...paneProps} />,
            icon: <SettingsIcon />
        }, {
            key: SettingsPaneEnum.MAPS,
            component: <MapsSettingsPane {...paneProps} />,
            icon: <MapIcon />
        }, {
            key: SettingsPaneEnum.REMINDERS,
            component: <RemindersSettingsPane {...paneProps} />,
            icon: <NotificationsIcon />
        }, {
            key: SettingsPaneEnum.DEVELOPER,
            component: <DeveloperSettingsPane {...paneProps} />,
            icon: <CodeIcon />
        }];

        const currentPane = panes.find(pane => pane.key === activePane) as PaneConfig;

        return (
            <Dialog id={"settings-dialog"} open={this.props.menuOpen} fullWidth={true}>
                <DialogTitle onClose={this.onClose}>Settings</DialogTitle>

                <Drawer
                    //className={classes.drawer}
                    variant="permanent"
                    //classes={{paper: classes.drawerPaper,}}
                    //anchor="left"
                >
                    <Divider />
                    <List>
                        {panes.map((pane) => (
                            <ListItem
                                button
                                key={pane.key}
                                onClick={() => this.setActivePane(pane.key)}
                                selected={pane.key === activePane}
                            >
                                <ListItemIcon>{pane.icon}</ListItemIcon>
                                <ListItemText primary={pane.key} />
                            </ListItem>
                        ))}
                    </List>
                </Drawer>

                <div className={"dialog-main"}>
                    <DialogContent>
                        {currentPane.component}
                    </DialogContent>
                </div>
            </Dialog>
        )
    }
}
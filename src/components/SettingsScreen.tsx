import React from "react";
import StopSearch from "./StopSearch";
import autoBind from "auto-bind";
import SettingsSet from "../classes/SettingsSet";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField"
import {createStyles, InputLabel, Theme, withStyles} from "@material-ui/core";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import Typography from "@material-ui/core/Typography";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Box from "@material-ui/core/Box";

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

export interface SettingsScreenProps {
    settings: SettingsSet
    menuOpen: boolean
    onUpdate: (key: string, value: any) => void,
    onClose: () => void;
}

export default class SettingsScreen extends React.Component<SettingsScreenProps, {}> {
    static tryParseInt(value: string, def = 0) {
        const int = parseInt(value);
        return isNaN(int) ? def : int;
    }

    constructor(props) {
        super(props);
        autoBind.react(this);
    }

    render() {
        return (
            <Dialog id={"settings-dialog"} open={this.props.menuOpen} fullWidth={true} maxWidth={"sm"}>
                <DialogTitle onClose={this.onClose}>
                    Settings
                </DialogTitle>
                <DialogContent>
                    <div className="settings-row">
                        <InputLabel htmlFor={"stopSearchFrom"} shrink={true}>
                            From stop
                        </InputLabel>

                        <StopSearch
                            settings={this.props.settings}
                            inputId={"stopSearchFrom"}
                            label="From"
                            value={this.props.settings.fromStop}
                            onSelect={(s) => this.onUpdateSetting("fromStop", s)} />
                    </div>

                    <div className="settings-row">
                        <InputLabel htmlFor={"stopSearchTo"} shrink={true}>
                            To stop
                        </InputLabel>

                        <StopSearch
                            settings={this.props.settings}
                            inputId={"stopSearchTo"}
                            label="To"
                            value={this.props.settings.toStop}
                            onSelect={(s) => this.onUpdateSetting("toStop", s)} />
                    </div>

                    <div className="settings-row">
                        <TextField
                                id="inputWalkTime"
                                label="Walking time (mins)"
                                type="number"
                                value={this.props.settings.walkTime}
                                onChange={event => this.onUpdateSetting("walkTime", SettingsScreen.tryParseInt(event.target.value))} />
                        <TextField
                            id="inputWalkTime"
                            label="Walking time buffer (mins)"
                            type="number"
                            value={this.props.settings.walkTimeBuffer}
                            onChange={event => this.onUpdateSetting("walkTimeBuffer", SettingsScreen.tryParseInt(event.target.value))} />
                    </div>

                    <ExpansionPanel>
                        <ExpansionPanelSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            Advanced Settings
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <div className="settings-row">
                                <TextField
                                    label="TfNSW API Key"
                                    value={this.props.settings.apiKey}
                                    onChange={event => this.onUpdateSetting("apiKey", event.target.value)}
                                    />
                            </div>

                            <div className="settings-row">
                                <TextField
                                    label="Proxy Server"
                                    value={this.props.settings.proxyServer}
                                    onChange={event => this.onUpdateSetting("proxyServer", event.target.value)}
                                    />
                            </div>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                </DialogContent>
            </Dialog>
        )
    }

    onClose() {
        this.props.onClose();
    }

    onUpdateSetting(key: string, value: any) {
        this.props.onUpdate(key, value);
    }
}
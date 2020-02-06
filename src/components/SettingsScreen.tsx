import {createStyles, InputLabel, Theme, withStyles} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import IconButton from "@material-ui/core/IconButton";
import Slider from "@material-ui/core/Slider";
import TextField from "@material-ui/core/TextField"
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import autoBind from "auto-bind";
import React from "react";
import SettingsSet from "../classes/SettingsSet";
import StopSearch from "./StopSearch";

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
                        <InputLabel shrink={true}>
                            Walking time (mins)
                        </InputLabel>

                        <Slider
                            value={this.props.settings.walkTimeRange}
                            onChange={(event, newValue: number | number[]) => this.onUpdateSetting("walkTimeRange", newValue)}
                            valueLabelDisplay="auto"
                            aria-labelledby="range-slider"
                            min={0}
                            max={30}
                        />
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
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
import Typography from "@material-ui/core/Typography";

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
    constructor(props) {
        super(props);
        autoBind.react(this);
    }

    render() {
        return (
            <Dialog open={this.props.menuOpen} fullWidth={true} maxWidth={"xl"}>
                <DialogTitle onClose={this.onClose}>
                    Settings
                </DialogTitle>
                <DialogContent>
                    <InputLabel htmlFor={"stopSearchFrom"} shrink={true}>
                        From stop
                    </InputLabel>

                    <StopSearch
                        inputId={"stopSearchFrom"}
                        label="From"
                        value={this.props.settings.fromStop}
                        onSelect={(s) => this.onUpdateSetting("fromStop", s)} />

                    <InputLabel htmlFor={"stopSearchTo"} shrink={true}>
                        To stop
                    </InputLabel>

                    <StopSearch
                        inputId={"stopSearchTo"}
                        label="To"
                        value={this.props.settings.toStop}
                        onSelect={(s) => this.onUpdateSetting("toStop", s)} />

                    <TextField
                            id="inputWalkTime"
                            label="Walking Time (mins)"
                            type="number"
                            value={this.props.settings.walkTime}
                            onChange={event => this.onUpdateSetting("walkTime", event.target.value)} />
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
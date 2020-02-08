import {FormControlLabel} from "@material-ui/core";
import Switch from "@material-ui/core/Switch";
import TextField from "@material-ui/core/TextField";
import React from "react";
import SettingsPane from "./SettingsPane";

export default class MapsSettingsPane extends SettingsPane {
    render() {
        return (
            <div id={this.constructor.name}>
                <div className="settings-row">
                    <FormControlLabel
                        control={
                            <Switch
                                checked={this.props.settings.maps.enabled}
                                onChange={event => this.onUpdateSetting("maps.enabled", event.target.checked)}
                                value="maps.enabled"
                                color="primary"
                            />
                        }
                        label="Enable Maps widget"
                    />
                </div>
                <div className="settings-row">
                    <TextField
                        fullWidth
                        label="Google Maps API Key"
                        value={this.props.settings.maps.apiKey}
                        onChange={event => this.onUpdateSetting("maps.apiKey", event.target.value)}
                    />
                </div>
            </div>
        )
    }
}
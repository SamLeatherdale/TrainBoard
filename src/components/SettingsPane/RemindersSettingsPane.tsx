import {FormControlLabel} from "@material-ui/core";
import Switch from "@material-ui/core/Switch";
import TextField from "@material-ui/core/TextField";
import React from "react";
import SettingsPane from "./SettingsPane";

export default class RemindersSettingsPane extends SettingsPane {
    render() {
        return (
            <div id={this.constructor.name}>
                <div className="settings-row">
                    <FormControlLabel
                        control={
                            <Switch
                                checked={this.props.settings.reminders.enabled}
                                onChange={event => this.onUpdateSetting("reminders.enabled", event.target.checked)}
                                value="reminders.enabled"
                                color="primary"
                            />
                        }
                        label="Enable Reminders widget"
                    />
                </div>

                <div className="settings-row">
                    <TextField
                        label="Reminder title"
                        value={this.props.settings.reminders.title}
                        onChange={event => this.onUpdateSetting("reminders.title", event.target.value)}
                    />
                </div>

                <TextField
                    label="Reminder items (one per line)"
                    fullWidth
                    multiline
                    value={this.props.settings.reminders.itemList.join("\n")}
                    onChange={event => this.onUpdateSetting("reminders.itemList", event.target.value.split("\n"))}
                    variant="outlined"
                />
            </div>
        )
    }
}
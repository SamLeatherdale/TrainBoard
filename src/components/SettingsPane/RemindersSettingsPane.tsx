import React from "react";

import { FormControlLabel } from "@mui/material";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";

import { SettingsPaneProps } from "./SettingsPane";

export default function RemindersSettingsPane(props: SettingsPaneProps) {
    const { onUpdate } = props;
    const { enabled, title, itemList } = props.settings.reminders;
    return (
        <div id={RemindersSettingsPane.name}>
            <div className="settings-row">
                <FormControlLabel
                    control={
                        <Switch
                            checked={enabled}
                            onChange={(event) =>
                                onUpdate("reminders.enabled", event.target.checked)
                            }
                            color="primary"
                            tabIndex={0}
                        />
                    }
                    label="Enable Reminders widget"
                />
            </div>

            <div className="settings-row">
                <TextField
                    label="Reminder title"
                    value={title}
                    onChange={(event) => onUpdate("reminders.title", event.target.value)}
                />
            </div>

            <TextField
                label="Reminder items (one per line)"
                fullWidth
                multiline
                value={itemList.join("\n")}
                onChange={(event) => onUpdate("reminders.itemList", event.target.value.split("\n"))}
                variant="outlined"
            />
        </div>
    );
}

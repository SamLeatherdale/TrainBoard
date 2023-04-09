import React from "react";

import { FormControlLabel } from "@mui/material";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";

import { SettingsPaneProps } from "./SettingsPane";

export default function MapsSettingsPane(props: SettingsPaneProps) {
    const { onUpdate } = props;
    const { enabled, apiKey } = props.settings.maps;
    return (
        <div id={MapsSettingsPane.name}>
            <div className="settings-row">
                <FormControlLabel
                    control={
                        <Switch
                            checked={enabled}
                            onChange={(event) => onUpdate("maps.enabled", event.target.checked)}
                            value="maps.enabled"
                            color="primary"
                            tabIndex={0}
                        />
                    }
                    label="Enable Maps widget"
                />
            </div>
            <div className="settings-row">
                <TextField
                    fullWidth
                    label="Google Maps API Key"
                    value={apiKey}
                    onChange={(event) => onUpdate("maps.apiKey", event.target.value)}
                />
            </div>
        </div>
    );
}

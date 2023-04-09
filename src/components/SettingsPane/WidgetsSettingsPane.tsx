import React from "react";

import { FormControlLabel } from "@mui/material";
import Switch from "@mui/material/Switch";

import { SettingsPaneProps } from "./SettingsPane";

export default function WidgetsSettingsPane(props: SettingsPaneProps) {
    const { onUpdate } = props;
    const { mapsEnabled } = props.settings;
    return (
        <div id={WidgetsSettingsPane.name}>
            <div className="settings-row">
                <FormControlLabel
                    control={
                        <Switch
                            checked={mapsEnabled}
                            onChange={(event) => onUpdate("mapsEnabled", event.target.checked)}
                            color="primary"
                            tabIndex={0}
                        />
                    }
                    label="Enable Maps widget"
                />
            </div>
        </div>
    );
}

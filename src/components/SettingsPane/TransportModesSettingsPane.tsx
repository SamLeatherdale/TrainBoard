import React from "react";

import { Box, FormControlLabel } from "@mui/material";
import Alert from "@mui/material/Alert";
import Switch from "@mui/material/Switch";

import { TransportModeId, transportModes } from "../../classes/LineType";
import { TransportModeIcon } from "../TripBoard/TripIcon";

import { SettingsPaneProps } from "./SettingsPane";

export default function TransportModesSettingsPane(props: SettingsPaneProps) {
    const { onUpdate } = props;
    const { excludedModes } = props.settings;
    const sortedTransportModeIds = [
        TransportModeId.Train,
        TransportModeId.Metro,
        TransportModeId.Bus,
        TransportModeId.LightRail,
        TransportModeId.Ferry,
        TransportModeId.Coach,
        TransportModeId.SchoolBus,
    ];
    return (
        <div id={TransportModesSettingsPane.name}>
            <Alert severity="info">
                Toggling the modes below will control which transport types are included for trip
                planning, and also which stops are shown in the stop search.
            </Alert>
            <Box>
                {sortedTransportModeIds.map((id) => {
                    const mode = transportModes[id];
                    return (
                        <FormControlLabel
                            sx={{
                                width: "50%",
                                mr: 0,
                                my: 1,
                            }}
                            key={mode.id}
                            control={
                                <Switch
                                    checked={!excludedModes.includes(mode.id)}
                                    onChange={(event) => {
                                        const checked = event.target.checked;
                                        const set = new Set(excludedModes);
                                        // Flipped because we're checking if it's excluded
                                        if (checked) {
                                            set.delete(mode.id);
                                        } else {
                                            set.add(mode.id);
                                        }
                                        onUpdate("excludedModes", Array.from(set.values()));
                                    }}
                                    value={mode.id}
                                    color="primary"
                                    tabIndex={0}
                                />
                            }
                            label={
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <TransportModeIcon mode={mode} />
                                    Enable {mode.name}
                                </Box>
                            }
                        />
                    );
                })}
            </Box>
        </div>
    );
}

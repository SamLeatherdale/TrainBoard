import React from "react";

import { Box, FormControlLabel } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";

import { TransportModeId, transportModes } from "../../classes/LineType";
import { TransportModeIcon } from "../TripBoard/TripIcon";

import { SettingsPaneProps } from "./SettingsPane";

export default function TransportModesSettingsPane(props: SettingsPaneProps) {
    const { onUpdate } = props;
    const { excludedModes } = props.settings;
    const sortedTransportModeIds = [
        TransportModeId.Train,
        TransportModeId.Metro,
        TransportModeId.LightRail,
        TransportModeId.Ferry,
        TransportModeId.Bus,
        TransportModeId.SchoolBus,
        TransportModeId.Coach,
    ];
    return (
        <div id={TransportModesSettingsPane.name}>
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, minmax(100px, 1fr))",
                }}
            >
                {sortedTransportModeIds.map((id) => {
                    const mode = transportModes[id];
                    return (
                        <FormControlLabel
                            key={mode.id}
                            control={
                                <Checkbox
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
                                    color="primary"
                                    tabIndex={0}
                                />
                            }
                            label={
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <TransportModeIcon mode={mode} />
                                    Show {mode.name} trips
                                </Box>
                            }
                        />
                    );
                })}
            </Box>
        </div>
    );
}

import React from "react";

import { InputLabel } from "@mui/material";
import Button from "@mui/material/Button";

import { isDev } from "../../util/env";
import RangeInput from "../RangeInput";
import StopSearch from "../StopSearch";

import { SettingsPaneProps } from "./SettingsPane";

export default function GeneralSettingsPane(props: SettingsPaneProps) {
    const { onUpdate, settings } = props;
    const { fromStop, toStop, walkTime, tripCount } = props.settings;
    return (
        <div id={GeneralSettingsPane.name}>
            <div className="settings-row">
                <InputLabel htmlFor={"stopSearchFrom"} shrink={true}>
                    From stop
                </InputLabel>

                <StopSearch
                    settings={settings}
                    label="Origin"
                    tabIndex={1}
                    value={fromStop}
                    onSelect={(s) => onUpdate("fromStop", s)}
                />
            </div>

            <div className="settings-row">
                <InputLabel htmlFor={"stopSearchTo"} shrink={true}>
                    To stop
                </InputLabel>

                <StopSearch
                    settings={props.settings}
                    tabIndex={3}
                    label="Destination"
                    value={toStop}
                    onSelect={(s) => onUpdate("toStop", s)}
                />
            </div>

            <div className="settings-row">
                <InputLabel>Walking time (mins): {walkTime}</InputLabel>

                <RangeInput
                    value={walkTime}
                    onChange={(newValue) => onUpdate("walkTime", newValue)}
                    min={0}
                    max={30}
                />
            </div>

            <div className="settings-row">
                <InputLabel>Number of trips to display: {tripCount}</InputLabel>

                <RangeInput
                    value={tripCount}
                    onChange={(newValue) => onUpdate("tripCount", newValue)}
                    min={5}
                    max={10}
                />
            </div>

            {isDev() && false && (
                <div className="settings-row">
                    <Button variant="contained" color="error" onClick={props.onReset}>
                        Reset all Settings
                    </Button>
                </div>
            )}
        </div>
    );
}

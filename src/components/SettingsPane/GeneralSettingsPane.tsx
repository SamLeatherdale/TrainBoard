import React from "react";

import { InputLabel } from "@mui/material";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";

import { isDev } from "../../util/env";
import RangeInput from "../RangeInput";
import StopSearch from "../StopSearch";

import { SettingsPaneProps } from "./SettingsPane";
import { SettingsRow } from "./SettingsRow";

export default function GeneralSettingsPane(props: SettingsPaneProps) {
    const { onUpdate, settings } = props;
    const { fromStop, toStop, walkTime, tripCount } = props.settings;
    return (
        <div id={GeneralSettingsPane.name}>
            <Alert severity="info">
                If you're seeing too many search results, try changing which modes of transport are
                enabled in the Modes tab.
            </Alert>
            <SettingsRow>
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
            </SettingsRow>

            <SettingsRow>
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
            </SettingsRow>

            <SettingsRow>
                <InputLabel>Walking time (mins): {walkTime}</InputLabel>

                <RangeInput
                    value={walkTime}
                    onChange={(newValue) => onUpdate("walkTime", newValue)}
                    min={0}
                    max={30}
                />
            </SettingsRow>

            <SettingsRow>
                <InputLabel>Number of trips to display: {tripCount}</InputLabel>

                <RangeInput
                    value={tripCount}
                    onChange={(newValue) => onUpdate("tripCount", newValue)}
                    min={5}
                    max={10}
                />
            </SettingsRow>

            {isDev() && false && (
                <SettingsRow>
                    <Button variant="contained" color="error" onClick={props.onReset}>
                        Reset all Settings
                    </Button>
                </SettingsRow>
            )}
        </div>
    );
}

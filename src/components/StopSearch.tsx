import React, { useState } from "react";

import { Box, CircularProgress, InputAdornment, NativeSelect } from "@mui/material";
import TextField from "@mui/material/TextField";
import { useDebouncedCallback } from "use-debounce";

import APIClient from "../classes/APIClient";
import { SettingsSet } from "../classes/SettingsSet";
import { StopFinderLocation } from "../models/TripPlanner/stopFinderLocation";

type Option = {
    label: string;
    value: string;
};
interface StopSearchProps {
    tabIndex: number;
    settings: SettingsSet;
    label: string;
    onSelect: (stop?: StopFinderLocation) => any;
    value?: StopFinderLocation;
}

export default function StopSearch(props: StopSearchProps) {
    const {
        value,
        label,
        settings: { recentStops },
    } = props;
    const [isLoading, setIsLoading] = useState(false);
    const [query, setQuery] = useState("");
    const [stops, setStops] = useState<StopFinderLocation[] | null>(value ? [value] : null);
    const options =
        stops === null
            ? [
                  {
                      label: `Search for ${label}`,
                      value: "",
                  },
              ]
            : [
                  { label: `Select location (${stops.length})`, value: "" },
                  ...stops.map(locToOption),
              ];

    const debounceGetStops = useDebouncedCallback(getStops, 250);

    function locToOption(loc: StopFinderLocation): Option {
        return { label: loc.name as string, value: loc.id as string };
    }

    function onChange(query: string) {
        setQuery(query);
        debounceGetStops(query);
    }

    function onSelectInputChange(query: string) {
        debounceGetStops(query);
    }

    function onSelect(selectedId: string) {
        const stop = (stops || []).concat(recentStops || []).find((stop) => stop.id === selectedId);
        if (stop) {
            props.onSelect(stop);
        }
    }

    async function getStops(query: string) {
        const client = new APIClient();
        setIsLoading(true);
        const locations = await client.getStopsByMode(query, props.settings.excludedModes);

        setIsLoading(false);
        setStops(locations);
    }

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                "> *": {
                    width: "50%",
                },
            }}
        >
            <TextField
                slotProps={{
                    htmlInput: { tabIndex: 0 },
                    input: {
                        endAdornment: isLoading ? (
                            <InputAdornment position="end">
                                <CircularProgress size={20} />
                            </InputAdornment>
                        ) : null,
                    },
                }}
                variant="outlined"
                onChange={(e) => onChange(e.target.value)}
                value={query}
            />
            <NativeSelect
                disableUnderline={true}
                sx={{
                    minWidth: 200,
                }}
                inputProps={{ tabIndex: 0 }}
                value={props.value?.id}
                onChange={(e) => onSelect(e.target.value)}
                variant="outlined"
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
                {recentStops?.length && (
                    <optgroup label="Recent Stops">
                        {recentStops.map((stop) => {
                            const option = locToOption(stop);
                            return (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            );
                        })}
                    </optgroup>
                )}
            </NativeSelect>
        </Box>
    );
}

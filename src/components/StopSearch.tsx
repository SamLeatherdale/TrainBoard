import React, { useState } from "react";

import { Box, CircularProgress, NativeSelect } from "@mui/material";
import TextField from "@mui/material/TextField";
import { useDebouncedCallback } from "use-debounce";

import APIClient from "../classes/APIClient";
import SettingsSet from "../classes/SettingsSet";
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
    const { value, label } = props;
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
        if (!stops) {
            return;
        }
        props.onSelect(selectedId ? stops.find((stop) => stop.id === selectedId) : undefined);
    }

    async function getStops(query: string) {
        const client = new APIClient();
        setIsLoading(true);
        const locations = await client.getTrainStops(query);

        setIsLoading(false);
        setStops(locations);
    }

    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <TextField
                inputProps={{
                    className: "dpad-focusable",
                    tabIndex: 0,
                }}
                variant="outlined"
                onChange={(e) => onChange(e.target.value)}
                value={query}
            />
            {isLoading && <CircularProgress />}
            <NativeSelect
                inputProps={{
                    className: "dpad-focusable",
                    tabIndex: 0,
                }}
                value={props.value?.id}
                onChange={(e) => onSelect(e.target.value)}
                variant="outlined"
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </NativeSelect>
        </Box>
    );
}

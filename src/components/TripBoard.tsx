import React from "react";

import { Box } from "@mui/material";

import { getTripId } from "../classes/ParsedTripId";
import { SettingsSet } from "../classes/SettingsSet";
import { TPJourney } from "../models/TripPlanner/custom/TPJourney";

import TripItem from "./TripBoard/TripItem";

interface TripBoardProps {
    trips: TPJourney[];
    settings: SettingsSet;
}

export default function TripBoard(props: TripBoardProps) {
    const { trips, settings } = props;
    const filteredTrips = (trips || []).filter(isTripNotExpired).slice(0, props.settings.tripCount);

    function isTripNotExpired(trip: TPJourney) {
        const departureEst = trip.legs[0].origin.departureTimeEstimated;
        console.log(trip.legs[0].origin.departureTimeEstimated, departureEst, new Date());
        return departureEst > new Date();
    }

    return (
        <Box component="ul" sx={{ listStyle: "none", padding: 0, margin: 0 }}>
            {filteredTrips.map((trip) => (
                <TripItem journey={trip} key={getTripId(trip)} walkTime={settings.walkTime} />
            ))}
        </Box>
    );
}

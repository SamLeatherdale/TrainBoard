import React from "react";

import { Box } from "@mui/material";

import { getTripId } from "../classes/ParsedTripId";
import { SettingsSet } from "../classes/SettingsSet";
import { ParsedVehiclePositionEntity } from "../models/GTFS/VehiclePositions";
import { TripRequestResponseJourney } from "../models/TripPlanner/tripRequestResponseJourney";
import { parseLocalDateTime } from "../util/date";

import TripItem from "./TripBoard/TripItem";

interface TripBoardProps {
    trips: TripRequestResponseJourney[];
    realtimeTripData: ParsedVehiclePositionEntity[];
    settings: SettingsSet;
}

export default function TripBoard(props: TripBoardProps) {
    const { trips, realtimeTripData, settings } = props;
    const filteredTrips = (trips || []).filter(isTripNotExpired).slice(0, props.settings.tripCount);

    function isTripNotExpired(trip: TripRequestResponseJourney) {
        const departureEst = parseLocalDateTime(trip.legs[0].origin.departureTimeEstimated);
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

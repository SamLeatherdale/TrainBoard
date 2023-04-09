import React from "react";

import { Box, Card } from "@mui/material";
import { styled } from "@mui/material/styles";

import ParsedTripId from "../../classes/ParsedTripId";
import { getTrainSet } from "../../classes/TrainSets";
import { TripRequestResponseJourney } from "../../models/TripPlanner/tripRequestResponseJourney";
import { TripRequestResponseJourneyLeg } from "../../models/TripPlanner/tripRequestResponseJourneyLeg";
import {
    formatShortTime,
    getDepartureTimeClass,
    getPlannedEstimatedDiff,
    getRelativeFriendlyTime,
    parseLocalDateTime,
} from "../../util/date";

import TripLabel from "./TripLabel";

export default function TripItem({
    journey,
    walkTime,
}: {
    journey: TripRequestResponseJourney;
    walkTime: number;
}) {
    const legs = journey.legs as TripRequestResponseJourneyLeg[];

    const first = legs[0];
    const last = legs[legs.length - 1];
    const parsedTripId = new ParsedTripId(first.transportation?.properties?.RealtimeTripId || "");

    // if (parsedTripId.valid) {
    //     realtime = this.props.realtimeTripData.find(entity => entity.parsedTripId.equals(parsedTripId));
    // }

    const departurePlanned = parseLocalDateTime(first.origin.departureTimePlanned);
    const departureEst = parseLocalDateTime(first.origin.departureTimeEstimated);
    const arrivalEst = parseLocalDateTime(last.destination.arrivalTimeEstimated);
    const now = new Date();
    const rating = getDepartureTimeClass(walkTime, departureEst);

    const departureLabel = departureEst > now ? "departing" : "departed";
    const departureDiff = getPlannedEstimatedDiff(departurePlanned, departureEst);
    const tripTimeDiff = getRelativeFriendlyTime(departureEst, arrivalEst);

    return (
        <Box component="li" sx={{ mx: 3, my: 3 }} tabIndex={0}>
            <Card>
                <BoardItem color={rating}>
                    <DepartureArrival color={rating}>
                        <span>{getRelativeFriendlyTime(departureEst)}</span>
                        <span>{formatShortTime(departureEst)}</span>
                    </DepartureArrival>
                    <CenterItem>
                        <TripLabel legs={legs} all />
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <LateIndicator color={departureDiff.color} />
                                {departureDiff.label}
                            </Box>
                            {parsedTripId.valid && (
                                <span>{`${parsedTripId.numberOfCars} car ${
                                    getTrainSet(parsedTripId.setType).name
                                }`}</span>
                            )}
                        </Box>
                    </CenterItem>
                    <DepartureArrival color={rating}>
                        <span>{tripTimeDiff}</span>
                        <span>{formatShortTime(arrivalEst)}</span>
                    </DepartureArrival>
                </BoardItem>
            </Card>
        </Box>
    );
}

const BoardItem = styled("div")((props) => ({
    display: "flex",
    alignItems: "stretch",
    border: `1px solid ${props.color}`,
}));
const CenterItem = styled("div")((props) => ({
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: props.theme.spacing(1),
    width: `calc(100% - 12em)`,
    overflow: "hidden",
}));
const DepartureArrival = styled("div")(
    // convert the below to a styled component of object syntax
    // https://styled-components.com/docs/basics#passed-props
    (props) => ({
        width: "6em",
        padding: props.theme.spacing(2),
        gap: props.theme.spacing(1),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        whiteSpace: "nowrap",
        border: `1px solid ${props.color}`,
        backgroundColor: props.color,
        color: "white",
    })
);
// Convert the below to a styled component
const LateIndicator = styled("span")((props) => ({
    width: 10,
    height: 10,
    display: "inline-block",
    backgroundColor: props.color,
    marginRight: props.theme.spacing(1),
}));

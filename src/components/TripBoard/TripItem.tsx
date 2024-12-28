import React from "react";

import { Block, NearMeDisabled } from "@mui/icons-material";
import { Box, Card, CircularProgress } from "@mui/material";
import { styled } from "@mui/material/styles";

import ParsedTripId from "../../classes/ParsedTripId";
import { getTrainSet } from "../../classes/TrainSets";
import { CancelStatus } from "../../models/TripPlanner/custom/CancelStatus";
import { TPJourney } from "../../models/TripPlanner/custom/TPJourney";
import {
    formatShortTime,
    getDepartureTimeClass,
    getPlannedEstimatedDiff,
    getRelativeFriendlyTime,
} from "../../util/date";

import TripLabel from "./TripLabel";

export default function TripItem({ journey, walkTime }: { journey: TPJourney; walkTime: number }) {
    const legs = journey.legs;

    const first = legs[0];
    const last = legs[legs.length - 1];
    const parsedTripId = new ParsedTripId(first.transportation?.properties?.RealtimeTripId || "");

    const departurePlanned = first.origin.departureTimePlanned;
    const departureEst = first.origin.departureTimeEstimated;
    const arrivalEst = last.destination.arrivalTimeEstimated;
    const rating = journey.cancelStatus ? "" : getDepartureTimeClass(walkTime, departureEst);

    const departureDiff = getPlannedEstimatedDiff(departurePlanned, departureEst);
    const tripTimeDiff = getRelativeFriendlyTime(departureEst, arrivalEst);

    function getRealtimeIndicator() {
        if (journey.cancelStatus) return <Block fontSize="small" />;
        if (journey.hasRealtime === false) return <NearMeDisabled fontSize="small" />;
        if (journey.hasRealtime) return <LateIndicator color={departureDiff.color} />;
        return <CircularProgress size={10} sx={{ color: "text.primary" }} />;
    }

    function getRealtimeLabel() {
        if (journey.cancelStatus === CancelStatus.CANCELLED) return "Cancelled";
        if (journey.cancelStatus === CancelStatus.SKIPPED) return "Skipped";
        if (journey.hasRealtime === false) return "No realtime";
        return departureDiff.label;
    }

    return (
        <Box component="li" sx={{ mx: 3, my: 3 }} tabIndex={0}>
            <Card>
                <BoardItem color={rating}>
                    <DepartureArrival color={rating} isCancelled={!!journey.cancelStatus}>
                        <span>{getRelativeFriendlyTime(departureEst, new Date(), "in ")}</span>
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
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                {getRealtimeIndicator()}
                                {getRealtimeLabel()}
                            </Box>
                            {parsedTripId.valid && (
                                <span>{`${parsedTripId.numberOfCars} car ${
                                    getTrainSet(parsedTripId.setType).name
                                }`}</span>
                            )}
                        </Box>
                    </CenterItem>
                    <DepartureArrival color={rating} isCancelled={!!journey.cancelStatus}>
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
const DepartureArrival = styled("div")<{ isCancelled: boolean }>((props) => ({
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
    textDecoration: props.isCancelled ? "line-through" : "none",
}));
const LateIndicator = styled("span")((props) => ({
    width: 10,
    height: 10,
    display: "inline-block",
    backgroundColor: props.color,
}));

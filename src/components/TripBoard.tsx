import React, { Fragment, useEffect } from "react";

import { Card } from "@mui/material";
import Chip from "@mui/material/Chip";
import { differenceInMinutes, formatDistanceStrict } from "date-fns";

import {
    getLineType,
    getTransportMode,
    TransportMode,
    TransportModeId,
    transportModes,
} from "../classes/LineType";
import ParsedStation from "../classes/ParsedStation";
import ParsedTripId from "../classes/ParsedTripId";
import SettingsSet from "../classes/SettingsSet";
import { getTrainSet } from "../classes/TrainSets";
import { ParsedVehiclePositionEntity } from "../models/GTFS/VehiclePositions";
import { TripRequestResponseJourney } from "../models/TripPlanner/tripRequestResponseJourney";
import { TripRequestResponseJourneyLeg } from "../models/TripPlanner/tripRequestResponseJourneyLeg";
import { TripRequestResponseJourneyLegStop } from "../models/TripPlanner/tripRequestResponseJourneyLegStop";
import { formatShortTime, parseLocalDateTime } from "../util/date";

interface TripBoardProps {
    trips: TripRequestResponseJourney[];
    realtimeTripData: ParsedVehiclePositionEntity[];
    settings: SettingsSet;
    renderInterval: number; // In seconds
}

export default function TripBoard(props: TripBoardProps) {
    const { trips, realtimeTripData, settings, renderInterval } = props;
    const [lastRender, setLastRender] = React.useState(0);

    const timerKey = React.useRef(0);
    useEffect(() => {
        timerKey.current = window.setInterval(
            () => setLastRender(Date.now()),
            renderInterval * 1000
        );
        return () => clearInterval(timerKey.current);
    }, []);

    const getDepartureTimeClass = (time: Date) => {
        const diffMinutes = differenceInMinutes(time, new Date(), { roundingMethod: "floor" });
        const { walkTime } = settings;

        if (diffMinutes > walkTime) {
            return "success";
        } else if (diffMinutes < walkTime) {
            return "danger";
        } else {
            return "warning";
        }
    };

    const getTripIcon = (leg: TripRequestResponseJourneyLeg) => {
        const tripName = leg.transportation?.disassembledName?.toUpperCase();
        const transportMode = getTransportMode(leg.transportation?.product?.iconId);

        const isTrain = transportMode?.id === TransportModeId.Train;
        let color = transportModes[TransportModeId.Walk].color;
        if (isTrain && tripName) {
            color = getLineType(tripName).color;
        } else if (transportMode && tripName) {
            color = transportMode.color;
        } else if (transportMode) {
            return getTransportModeIcon(transportMode);
        }
        return (
            <Chip
                label={tripName}
                sx={{
                    backgroundColor: color,
                    color: "white",
                    border: "1px solid white",
                }}
                className="line-icon"
            />
        );
    };

    const getTransportModeIcon = (transportMode: TransportMode) => {
        const Icon = transportMode.icon;
        return (
            <Icon
                style={{
                    width: "1.5em",
                    height: "1.5em",
                }}
            />
        );
    };

    function getTripLabel(legs: TripRequestResponseJourneyLeg[], all = false) {
        let showLegs: TripRequestResponseJourneyLeg[];

        if (all) {
            showLegs = [...legs].slice(0, 2);
            showLegs.push(legs[legs.length - 1]);
        } else {
            const first = legs[0];
            const last = legs[legs.length - 1];
            showLegs = [first, last];
        }

        // Add the final one on again as destination
        return (
            <div className="board-item-legs">
                {showLegs.map((leg, i) => {
                    const transportMode = getTransportMode(leg.transportation?.product?.iconId);
                    const isLast = i === showLegs.length - 1;
                    const station: TripRequestResponseJourneyLegStop = isLast
                        ? leg.destination
                        : leg.origin;
                    const parsedStation = new ParsedStation(station);
                    const lineName = leg.transportation?.disassembledName;
                    let content;

                    if (parsedStation.isParseSuccess()) {
                        content = (
                            <>
                                {parsedStation.station}
                                <Chip sx={{ ml: 2 }} label={`P${parsedStation.platform}`} />
                            </>
                        );
                    } else {
                        content = station.disassembledName || station.name;
                        if (content && content.length > 30) {
                            content = content.substr(0, 30) + "...";
                        }
                    }

                    return (
                        <Fragment key={`fragment-${i}`}>
                            <span>{content}</span>
                            {!isLast && getTripIcon(leg)}
                        </Fragment>
                    );
                })}
            </div>
        );
    }

    function getPlannedEstimatedDiff(planned: Date, estimated: Date) {
        const minsLate = differenceInMinutes(estimated, planned, { roundingMethod: "floor" });

        if (minsLate === 0) {
            return {
                label: "On time",
                css: "onTime",
            };
        } else if (minsLate > 0) {
            return {
                label: `${minsLate} minutes late`,
                css: "late",
            };
        } else {
            return {
                label: `${Math.abs(minsLate)} minutes early`,
                css: "early",
            };
        }
    }

    function getPlural(str: string, count: number, suffix = "s") {
        return count === 1 ? str : `${str}${suffix}`;
    }

    function getRelativeFriendlyTime(time: Date) {
        const to = new Date();
        if (differenceInMinutes(time, to, { roundingMethod: "floor" }) === 0) {
            return "now";
        }
        return formatDistanceStrict(time, to, { roundingMethod: "floor" })
            .replace("minute", "min")
            .replace("hour", "hr");
    }

    function isTripNotExpired(trip: TripRequestResponseJourney) {
        const departureEst = parseLocalDateTime(trip.legs[0].origin.departureTimeEstimated);
        return departureEst > new Date();
    }

    function renderTrip(journey: TripRequestResponseJourney, key: number) {
        const legs = journey.legs as TripRequestResponseJourneyLeg[];

        const first = legs[0];
        const last = legs[legs.length - 1];
        const parsedTripId = new ParsedTripId(
            first.transportation?.properties?.RealtimeTripId || ""
        );

        // if (parsedTripId.valid) {
        //     realtime = this.props.realtimeTripData.find(entity => entity.parsedTripId.equals(parsedTripId));
        // }

        const departurePlanned = parseLocalDateTime(first.origin.departureTimePlanned);
        const departureEst = parseLocalDateTime(first.origin.departureTimeEstimated);
        const arrivalEst = parseLocalDateTime(last.destination.arrivalTimeEstimated);
        const now = new Date();
        const rating = getDepartureTimeClass(departureEst);

        const departureLabel = departureEst > now ? "departing" : "departed";
        const departureDiff = getPlannedEstimatedDiff(departurePlanned, departureEst);

        return (
            <li key={key} className="board-item-container">
                <Card>
                    <div className="board-item" data-rating={rating}>
                        <div className="board-departure">
                            {getRelativeFriendlyTime(departureEst)}
                        </div>
                        <div className="board-item-mid">
                            {getTripLabel(legs, true)}
                            <div className="board-departure-large">
                                {departureLabel} at {formatShortTime(departureEst)}
                            </div>
                            <div className="board-info-bottom">
                                <div
                                    className="board-departure-label"
                                    data-status={departureDiff.css}
                                >
                                    {departureDiff.label}
                                </div>
                                {parsedTripId.valid && (
                                    <div>{`${parsedTripId.numberOfCars} car ${
                                        getTrainSet(parsedTripId.setType).name
                                    }`}</div>
                                )}
                            </div>
                        </div>
                        <div className="board-arrival">{formatShortTime(arrivalEst)}</div>
                    </div>
                </Card>
            </li>
        );
    }

    const filteredTrips = (props.trips || [])
        .filter(isTripNotExpired)
        .slice(0, props.settings.tripCount);
    return <ul className="board-items">{filteredTrips.map(renderTrip)}</ul>;
}

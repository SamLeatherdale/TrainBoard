import {Card} from "@material-ui/core";
import Chip from "@material-ui/core/Chip";
import moment, {Moment} from "moment"
import React, {Fragment} from "react";
import ParsedStation from "../classes/ParsedStation";
import ParsedTripId from "../classes/ParsedTripId";
import SettingsSet from "../classes/SettingsSet";
import {getTrainSet} from "../classes/TrainSets";
import {ParsedVehiclePositionEntity} from "../models/GTFS/VehiclePositions";
import {TripRequestResponseJourney} from "../models/TripPlanner/tripRequestResponseJourney";
import {TripRequestResponseJourneyLeg} from "../models/TripPlanner/tripRequestResponseJourneyLeg";
import {TripRequestResponseJourneyLegStop} from "../models/TripPlanner/tripRequestResponseJourneyLegStop";
import AutoBoundComponent from "./AutoBoundComponent";
import {getLineType} from "../classes/LineType";


interface TripBoardProps {
    trips: TripRequestResponseJourney[],
    realtimeTripData: ParsedVehiclePositionEntity[],
    settings: SettingsSet,
    renderInterval: number; // In seconds
}

class TripBoardState {
    lastRender = 0;
}

export default class TripBoard extends AutoBoundComponent<TripBoardProps, TripBoardState> {
    protected renderIntervalKey = 0;

    constructor(props) {
        super(props);
        this.state = new TripBoardState();
    }

    componentDidMount(): void {
        this.renderIntervalKey = window.setInterval(this.forceRerender, this.props.renderInterval * 1000);
    }

    componentWillUnmount(): void {
        clearInterval(this.renderIntervalKey);
    }

    forceRerender() {
        this.setState({lastRender: Date.now()});
    }

    getDepartureTimeClass(time: Moment) {
        const diff = time.diff(moment.now(), "minutes"); //Positive if time > now
        const minTime = Math.min(...this.props.settings.walkTimeRange);
        const maxTime = Math.max(...this.props.settings.walkTimeRange);

        if (diff > maxTime) {
            return "success";
        } else if (diff < minTime) {
            return "danger";
        } else {
            return "warning";
        }
    }

    static getTripIcon(leg: TripRequestResponseJourneyLeg) {
        const tripName = leg.transportation?.disassembledName?.toUpperCase();
        if (!tripName) {
            return null;
        }

        const isTrain = tripName.startsWith('T');
        const className = isTrain ? 'line-icon-train' : 'line-icon-bus';
        const color = getLineType(tripName).color;
        const style = isTrain ? {backgroundColor: color} : {};
        return (
            <Chip
                label={tripName}
                style={style}
                className={['line-icon', className].join(' ')}
            />
        );
    }

    static getTripLabel(legs: TripRequestResponseJourneyLeg[], all = false) {
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
                    const isLast = i === showLegs.length - 1;
                    const station: TripRequestResponseJourneyLegStop = isLast ? leg.destination : leg.origin;
                    const parsedStation = new ParsedStation(station.name);
                    const lineName = leg.transportation?.disassembledName;
                    let content;

                    if (parsedStation.isParseSuccess()) {
                        content = <>
                            {parsedStation.station}
                            <Chip label={`P${parsedStation.platform}`} />
                        </>
                    } else {
                        content = station.parent.disassembledName;
                        if (content && content.length > 30) {
                            content = content.substr(0, 30) + '...';
                        }
                    }

                    return (
                    <Fragment key={`fragment-${i}`}>
                        <div key={i}>
                            <span>{content}</span>
                        </div>
                        {(!isLast && !!lineName) &&
                        <div key={`line-${i}`}>
                            {TripBoard.getTripIcon(leg)}
                        </div>}
                    </Fragment>
                    );
                })}
            </div>
        )
    }

    static getPlannedEstimatedDiff(planned: Moment, estimated: Moment) {
        const minsLate = estimated.diff(planned, "minutes");

        if (minsLate === 0) {
            return {
                label: "On time",
                css: "onTime"
            };
        } else if (minsLate > 0) {
            return {
                label: `${minsLate} minutes late`,
                css: "late"
            }
        } else {
            return {
                label: `${Math.abs(minsLate)} minutes early`,
                css: "early"
            }
        }
    }

    static getPlural(str: string, count: number, suffix = 's') {
        return count === 1 ? str : `${str}${suffix}`;
    }

    static getRelativeFriendlyTime(time: Moment, to?: Moment) {
        to = typeof to === "undefined" ? moment() : to;

        const minutesDiff = time.diff(to, "minutes");
        const hoursDiff = time.diff(to, "hours");

        if (hoursDiff > 0) {
            return `${hoursDiff} ${TripBoard.getPlural('hr', hoursDiff)}`
        } else if (minutesDiff > 0) {
            return `${minutesDiff} ${TripBoard.getPlural('min', minutesDiff)}`
        } else {
            return '<1 min';
        }
    }

    static isTripNotExpired(trip: TripRequestResponseJourney) {
        const departureEst = moment(trip.legs[0].origin.departureTimeEstimated);
        return departureEst.isAfter(moment(), "minutes");
    }

    render() {
        return (
            <ul className="board-items">
                {this.props.trips
                    .filter(TripBoard.isTripNotExpired)
                    .slice(0, this.props.settings.tripCount)
                    .map(this.renderTrip)}
            </ul>
        );
    }

    renderTrip(journey: TripRequestResponseJourney, key: number) {
        const legs = journey.legs as TripRequestResponseJourneyLeg[];

        const first = legs[0];
        const last = legs[legs.length - 1];
        const parsedTripId = new ParsedTripId(first.transportation?.properties?.RealtimeTripId || '');

        // if (parsedTripId.valid) {
        //     realtime = this.props.realtimeTripData.find(entity => entity.parsedTripId.equals(parsedTripId));
        // }

        const departurePlanned = moment(first.origin.departureTimePlanned);
        const departureEst = moment(first.origin.departureTimeEstimated);
        const arrivalEst = moment(last.destination.arrivalTimeEstimated);
        const rating = this.getDepartureTimeClass(departureEst);

        const departureRelative = departureEst.diff(moment.now(), "seconds");
        const departureLabel = departureRelative > 0 ? "departing" : "departed";
        const departureDiff = TripBoard.getPlannedEstimatedDiff(departurePlanned, departureEst);

        return (
            <li key={key} className="board-item-container">
                <Card>
                    <div className="board-item" data-rating={rating}>
                        <div className="board-departure">{TripBoard.getRelativeFriendlyTime(departureEst)}</div>
                        <div className="board-item-mid">
                            {TripBoard.getTripLabel(legs, true)}
                            <div className={"board-departure-large"}>
                                {departureLabel} at {departureEst.format("LT")}
                            </div>
                            <div className="board-info-bottom">
                                <div className="board-departure-label" data-status={departureDiff.css}>{departureDiff.label}</div>
                                {parsedTripId.valid &&
                                    <div>{`${parsedTripId.numberOfCars} car ${getTrainSet(parsedTripId.setType).name}`}</div>}
                            </div>
                        </div>
                        <div className="board-arrival">{arrivalEst.format("LT")}</div>
                    </div>
                </Card>
            </li>
        )
    }
}
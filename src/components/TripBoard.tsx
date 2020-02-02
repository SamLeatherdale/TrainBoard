import React from "react";
import moment, {Moment} from "moment"
import autoBind from "auto-bind";
import {TripRequestResponseJourney} from "../models/TripPlanner/tripRequestResponseJourney";
import SettingsSet from "../classes/SettingsSet";
import {TripRequestResponseJourneyLeg} from "../models/TripPlanner/tripRequestResponseJourneyLeg";


interface TripBoardProps {
    trips: TripRequestResponseJourney[],
    settings: SettingsSet
}

export default class TripBoard extends React.Component<TripBoardProps, {}> {
    constructor(props) {
        super(props);
        autoBind.react(this);
    }
    static getTripTime() {

    }

    static getDepartureTimeClass(time: Moment, threshold: number) {
        const diff = time.diff(moment.now(), "minutes"); //Positive if time > now
        const buffer = 2;

        if (diff > threshold + buffer) {
            return "text-success";
        } else if (diff < threshold - buffer) {
            return "text-danger";
        } else {
            return "text-warning";
        }
    }

    static getTripLabel(legs: TripRequestResponseJourneyLeg[]) {
        const first = legs[0];
        const last = legs[legs.length - 1];

        return `${first.origin?.parent?.disassembledName} ➡ ${last.destination?.parent?.disassembledName}`
    }

    render() {
        return (
            <ul>
                {this.props.trips.map(this.renderTrip)}
            </ul>
        );
    }

    renderTrip(trip: TripRequestResponseJourney) {
        const legs = trip.legs as TripRequestResponseJourneyLeg[];
        const first = legs[0];
        const last = legs[legs.length - 1];
        const departureEst = moment(first.origin?.departureTimeEstimated);
        const arrivalEst = moment(last.destination?.arrivalTimeEstimated);

        return (
            <li>
                <div className={TripBoard.getDepartureTimeClass(departureEst, this.props.settings.walkTime)}
                    >{departureEst.fromNow()}</div>
                <div>{TripBoard.getTripLabel(legs)}</div>
                <div>{arrivalEst.format("LT")}</div>
            </li>
        )
    }
}
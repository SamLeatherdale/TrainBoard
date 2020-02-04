import React from "react";
import moment, {Moment} from "moment"
import autoBind from "auto-bind";
import {TripRequestResponseJourney} from "../models/TripPlanner/tripRequestResponseJourney";
import SettingsSet from "../classes/SettingsSet";
import {TripRequestResponseJourneyLeg} from "../models/TripPlanner/tripRequestResponseJourneyLeg";
import {Card} from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";
import ParsedStation from "../classes/ParsedStation";


interface TripBoardProps {
    trips: TripRequestResponseJourney[],
    settings: SettingsSet
}

export default class TripBoard extends React.Component<TripBoardProps, {}> {
    constructor(props) {
        super(props);
        autoBind.react(this);
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

    static getPlannedEstimatedDiff(planned: Moment, estimated: Moment) {
        const minsLate = planned.diff(estimated, "minutes");

        if (minsLate === 0) {
            return "On time";
        } else if (minsLate > 0) {
            return `${minsLate} minutes late`
        } else {
            return `${Math.abs(minsLate)} minutes early`
        }
    }

    render() {
        return (
            <ul>
                {this.props.trips.map(this.renderTrip)}
            </ul>
        );
    }

    renderTrip(trip: TripRequestResponseJourney, key: number) {
        const legs = trip.legs as TripRequestResponseJourneyLeg[];

        const first = legs[0];
        const last = legs[legs.length - 1];
        const departurePlanned = moment(first.origin.departureTimePlanned);
        const departureEst = moment(first.origin.departureTimeEstimated);
        const arrivalEst = moment(last.destination.arrivalTimeEstimated);
        const departureStation = new ParsedStation(first.origin.name);
        const arrivalStation = new ParsedStation(last.destination.name);

        return (
            <li key={key}>
                <Card>
                    <CardContent>
                        <div className="board-item">
                            <div className="board-departure">{departureEst.format("LT")}</div>
                            <div>{TripBoard.getTripLabel(legs)}</div>
                            <div className={["board-departure-relative"
                                //TripBoard.getDepartureTimeClass(departureEst, this.props.settings.walkTime)}
                                ].join(' ')}>{departureEst.fromNow()}</div>
                            <div>{TripBoard.getPlannedEstimatedDiff(departurePlanned, departureEst)}</div>
                            <div className="board-arrival">{arrivalEst.format("LT")}</div>
                        </div>
                    </CardContent>
                </Card>
            </li>
        )
    }
}
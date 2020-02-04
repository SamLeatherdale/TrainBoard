import React from "react";
import moment, {Moment} from "moment"
import autoBind from "auto-bind";
import {TripRequestResponseJourney} from "../models/TripPlanner/tripRequestResponseJourney";
import SettingsSet from "../classes/SettingsSet";
import {TripRequestResponseJourneyLeg} from "../models/TripPlanner/tripRequestResponseJourneyLeg";
import {Card} from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";
import ParsedStation from "../classes/ParsedStation";
import Chip from "@material-ui/core/Chip";
import Typography from "@material-ui/core/Typography";


interface TripBoardProps {
    trips: TripRequestResponseJourney[],
    settings: SettingsSet,
    renderInterval: number; // In seconds
}

class TripBoardState {
    lastRender = 0;
}

export default class TripBoard extends React.Component<TripBoardProps, TripBoardState> {
    protected renderIntervalKey = 0;

    constructor(props) {
        super(props);
        autoBind.react(this);

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

    static getDepartureTimeClass(time: Moment, threshold: number) {
        const diff = time.diff(moment.now(), "minutes"); //Positive if time > now
        const buffer = 2;

        if (diff > threshold + buffer) {
            return "success";
        } else if (diff < threshold - buffer) {
            return "danger";
        } else {
            return "warning";
        }
    }

    static getTripLabel(legs: TripRequestResponseJourneyLeg[], all = false) {
        let showLegs: TripRequestResponseJourneyLeg[];

        if (all) {
            showLegs = legs;
        } else {
            const first = legs[0];
            const last = legs[legs.length - 1];
            showLegs = [first, last];
        }

        if (showLegs.length === 1) {
            showLegs = [showLegs[0], showLegs[0]]
        }

        return (
            <div className="board-item-legs">
                {showLegs.map((leg, i) => {
                    const isLast = i === showLegs.length - 1;
                    const station = isLast ? leg.destination : leg.origin;
                    const parsedStation = new ParsedStation(station.name);
                    return (
                        <div key={i}>
                            {parsedStation.station}
                            <Chip label={`P${parsedStation.platform}`} />
                        </div>
                    );
                })}
            </div>
        )
    }

    static getPlannedEstimatedDiff(planned: Moment, estimated: Moment) {
        const minsLate = planned.diff(estimated, "minutes");

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

        const secondsDiff = time.diff(to, "seconds");
        const minutesDiff = time.diff(to, "minutes");
        const hoursDiff = time.diff(to, "hours");

        if (hoursDiff > 0) {
            return `${hoursDiff} ${TripBoard.getPlural('hr', hoursDiff)}`
        } else if (minutesDiff > 0) {
            return `${minutesDiff} ${TripBoard.getPlural('min', minutesDiff)}`
        } else {
            return `${secondsDiff} ${TripBoard.getPlural('sec', secondsDiff)}`;
        }
    }

    static isTripNotExpired(trip: TripRequestResponseJourney) {
        const departureEst = moment(trip.legs[0].origin.departureTimeEstimated);
        return departureEst.isAfter(moment(), "minutes");
    }

    render() {
        return (
            <ul className="board-items">
                {this.props.trips.filter(TripBoard.isTripNotExpired).map(this.renderTrip)}
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
        const rating = TripBoard.getDepartureTimeClass(departureEst, this.props.settings.walkTime);

        const departureRelative = departurePlanned.diff(moment.now(), "seconds");
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
                            <div className="board-departure-label" data-status={departureDiff.css}>{departureDiff.label}</div>
                        </div>
                        <div className="board-arrival">{arrivalEst.format("LT")}</div>
                    </div>
                </Card>
            </li>
        )
    }
}
/**
 * The trip_id used to uniquely identify trips has a semantic content that could be used to
 * provide additional information about the timetabled train. The format is as follows:
 * <trip_name>.<timetable_id>.<timetable_version_id>.<dop_ref>.<set_type>.<number_of_cars>.<trip_instance>
 * Eg. ‘123J.1171.00000102.124.T.8.0’
 *
 *  *
 * <timetable_id>.<timetable_version_id>.<dop_ref> represent the calendar, so could provide
 * indications the bundle is out of date if values in real time feeds do not match bundle calendar
 * values.
 *
 * The fields <timetable_id>.<timetable_version_id>.<dop_ref> within the trip_id is not
 * recommended for use. This is reserved to keep the trip id unique.
 *
 * @see https://opendata.transport.nsw.gov.au/sites/default/files/TfNSW_Realtime_Train_Technical_Doc.pdf
 */

import { TPJourney } from "../models/TripPlanner/custom/TPJourney";

import { tryParseInt } from "./functions";
import { SetType } from "./TrainSets";

export default class ParsedTripId {
    tripName = "";
    timetableId = "";
    timetableVersionId = "";
    setType: SetType = SetType.UNKNOWN;
    numberOfCars = 0;
    tripInstance = "";

    valid = true;

    static tripEqual(a: ParsedTripId, b: ParsedTripId) {
        return (
            a.tripName === b.tripName &&
            a.timetableId === b.timetableId &&
            a.tripInstance === b.tripInstance
        );
    }

    static tripEqualStr(a: string, b: string) {
        return ParsedTripId.tripEqual(new ParsedTripId(a), new ParsedTripId(b));
    }

    constructor(tripId: string) {
        const parts = tripId.split(".");
        if (parts.length >= 6) {
            // Get trip parts (everything before the last 3 segments)
            const tripParts = parts.slice(0, -3);
            this.tripName = tripParts[0];
            // Store the calendar parts in the block ID
            this.timetableId = tripParts[1];
            this.timetableVersionId = tripParts[2];

            // Get set parts (last 3 segments)
            const setParts = parts.slice(-3);
            this.setType = setParts[0] as SetType;
            this.numberOfCars = tryParseInt(setParts[1]);
            this.tripInstance = setParts[2];
            this.valid = true;
        } else {
            this.valid = false;
        }
    }

    equals(trip: ParsedTripId) {
        return ParsedTripId.tripEqual(this, trip);
    }

    toEqualityString(): string {
        return this.tripName.slice(0, 3);
    }
}

export function getTripId(trip: TPJourney) {
    return trip.legs
        .map((leg) => leg.transportation?.properties?.RealtimeTripId || "walk")
        .join(",");
}

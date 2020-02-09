/**
 * The trip_id used to uniquely identify trips has a semantic content that could be used to
 * provide additional information about the timetabled train. The format is as follows:
 * <trip_name>.<timetable_id>.<timetable_version_id>.<dop_ref>.<set_type>.<number_of_cars>.<trip_instance>
 * Eg. ‘123J.1171.00000102.124.T.8.0’
 *
 * @see https://opendata.transport.nsw.gov.au/sites/default/files/TfNSW_Realtime_Train_Technical_Doc.pdf
 */
import {tryParseInt} from "./functions";
import {SetType} from "./TrainSets";



export default class ParsedTripId {
    tripName = "";
    timetableId = "";
    timetableVersionId = "";
    dopRef = "";
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
        if (parts.length >= 7) {
            this.tripName = parts[0];
            this.timetableId = parts[1];
            this.timetableVersionId = parts[2];
            this.dopRef = parts[3];
            this.setType = parts[4] as SetType;
            this.numberOfCars = tryParseInt(parts[5]);
            this.tripInstance = parts[6];
        } else {
            this.valid = false;
        }
    }

    equals(trip: ParsedTripId) {
        return ParsedTripId.tripEqual(this, trip);
    }

    toEqualityString(): string {
        return [this.tripName, this.timetableId, this.tripInstance].join('.');
    }
}
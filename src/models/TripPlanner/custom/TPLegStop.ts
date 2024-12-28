import { parseLocalDateTime } from "../../../util/date";
import { TripRequestResponseJourneyLegStop } from "../tripRequestResponseJourneyLegStop";

export interface TPLegStop
    extends Omit<
        TripRequestResponseJourneyLegStop,
        | "arrivalTimeEstimated"
        | "arrivalTimePlanned"
        | "departureTimeEstimated"
        | "departureTimePlanned"
    > {
    hasRealtime?: boolean;
    isSkipped?: boolean;
    arrivalTimeEstimated: Date;
    arrivalTimePlanned: Date;
    departureTimeEstimated: Date;
    departureTimePlanned: Date;
}

export function convertToNoRealtimeTPLegStop(
    stop: TripRequestResponseJourneyLegStop,
    hasRealtime: boolean | undefined
): TPLegStop {
    return {
        ...stop,
        arrivalTimeEstimated: parseLocalDateTime(stop.arrivalTimeEstimated),
        arrivalTimePlanned: parseLocalDateTime(stop.arrivalTimePlanned),
        departureTimeEstimated: parseLocalDateTime(stop.departureTimeEstimated),
        departureTimePlanned: parseLocalDateTime(stop.departureTimePlanned),
        hasRealtime,
    };
}

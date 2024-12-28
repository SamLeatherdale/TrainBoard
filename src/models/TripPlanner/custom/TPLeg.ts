import { TripRequestResponseJourneyLeg } from "../tripRequestResponseJourneyLeg";

import { CancelStatus } from "./CancelStatus";
import { convertToNoRealtimeTPLegStop, TPLegStop } from "./TPLegStop";

export interface TPLeg
    extends Omit<TripRequestResponseJourneyLeg, "origin" | "destination" | "stopSequence"> {
    hasRealtime?: boolean;
    cancelStatus?: CancelStatus;
    isDepartureOnly?: boolean;
    origin: TPLegStop;
    destination: TPLegStop;
    stopSequence?: TPLegStop[];
}

export function convertToNoRealtimeTPLeg(
    leg: TripRequestResponseJourneyLeg,
    hasRealtime: boolean | undefined
): TPLeg {
    return {
        ...leg,
        hasRealtime,
        origin: convertToNoRealtimeTPLegStop(leg.origin, hasRealtime),
        destination: convertToNoRealtimeTPLegStop(leg.destination, hasRealtime),
        stopSequence: leg.stopSequence?.map((stop) =>
            convertToNoRealtimeTPLegStop(stop, hasRealtime)
        ),
    };
}

import { TripRequestResponseJourneyLeg } from "../tripRequestResponseJourneyLeg";

import { CancelStatus } from "./CancelStatus";
import { convertToNoRealtimeTPLegStop, TPLegStop } from "./TPLegStop";

export interface TPLeg extends TripRequestResponseJourneyLeg {
    hasRealtime?: boolean;
    cancelStatus?: CancelStatus;
    isDepartureOnly?: boolean;
    origin: TPLegStop;
    destination: TPLegStop;
    stopSequence?: TPLegStop[];
}

export function convertToNoRealtimeTPLeg(leg: TripRequestResponseJourneyLeg): TPLeg {
    return {
        ...leg,
        hasRealtime: false,
        origin: convertToNoRealtimeTPLegStop(leg.origin),
        destination: convertToNoRealtimeTPLegStop(leg.destination),
    };
}

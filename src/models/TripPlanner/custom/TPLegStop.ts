import { TripRequestResponseJourneyLegStop } from "../tripRequestResponseJourneyLegStop";

export interface TPLegStop extends TripRequestResponseJourneyLegStop {
    hasRealtime?: boolean;
    isSkipped?: boolean;
}

export function convertToNoRealtimeTPLegStop(stop: TripRequestResponseJourneyLegStop): TPLegStop {
    return {
        ...stop,
        hasRealtime: false,
    };
}

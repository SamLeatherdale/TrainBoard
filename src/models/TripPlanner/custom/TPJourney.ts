import { TripRequestResponseJourney } from "../tripRequestResponseJourney";

import { CancelStatus } from "./CancelStatus";
import { convertToNoRealtimeTPLeg } from "./TPLeg";
import { TPLeg } from "./TPLeg";

export interface TPJourney extends TripRequestResponseJourney {
    hasRealtime?: boolean;
    cancelStatus?: CancelStatus;
    legs: TPLeg[];
}

export function convertToNoRealtimeTPJourney(journey: TripRequestResponseJourney): TPJourney {
    return {
        ...journey,
        hasRealtime: false,
        legs: journey.legs.map(convertToNoRealtimeTPLeg),
    };
}

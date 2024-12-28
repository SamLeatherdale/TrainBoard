import { TripRequestResponseJourney } from "../tripRequestResponseJourney";

import { CancelStatus } from "./CancelStatus";
import { convertToNoRealtimeTPLeg, TPLeg } from "./TPLeg";

export interface TPJourney extends Omit<TripRequestResponseJourney, "legs"> {
    hasRealtime?: boolean;
    cancelStatus?: CancelStatus;
    legs: TPLeg[];
}

export function convertToNoRealtimeTPJourney(
    journey: TripRequestResponseJourney,
    hasRealtime: boolean | undefined
): TPJourney {
    return {
        ...journey,
        hasRealtime,
        legs: journey.legs.map((leg) => convertToNoRealtimeTPLeg(leg, hasRealtime)),
    };
}

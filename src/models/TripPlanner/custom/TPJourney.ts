import { TripRequestResponseJourney } from "../tripRequestResponseJourney";

import { CancelStatus } from "./CancelStatus";
import { convertToTPLeg, TPLeg } from "./TPLeg";

export interface TPJourney extends Omit<TripRequestResponseJourney, "legs"> {
    hasRealtime?: boolean;
    cancelStatus?: CancelStatus;
    legs: TPLeg[];
}

export function convertToTPJourney(journey: TripRequestResponseJourney): TPJourney {
    return {
        ...journey,
        hasRealtime: undefined,
        legs: journey.legs.map(convertToTPLeg),
    };
}

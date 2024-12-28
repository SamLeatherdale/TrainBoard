import { TripRequestResponseJourneyLeg } from "../tripRequestResponseJourneyLeg";

import { CancelStatus } from "./CancelStatus";
import { convertToTPLegStop, TPLegStop } from "./TPLegStop";

export interface TPLeg
    extends Omit<TripRequestResponseJourneyLeg, "origin" | "destination" | "stopSequence"> {
    hasRealtime?: boolean;
    cancelStatus?: CancelStatus;
    isDepartureOnly?: boolean;
    origin: TPLegStop;
    destination: TPLegStop;
    stopSequence?: TPLegStop[];
}

export function convertToTPLeg(leg: TripRequestResponseJourneyLeg): TPLeg {
    return {
        ...leg,
        hasRealtime: undefined,
        origin: convertToTPLegStop(leg.origin),
        destination: convertToTPLegStop(leg.destination),
        stopSequence: leg.stopSequence?.map(convertToTPLegStop),
    };
}

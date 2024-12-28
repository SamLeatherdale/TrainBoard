import { TripRequestResponse } from "../tripRequestResponse";

import { TPJourney } from "./TPJourney";

export interface TPResponse extends Omit<TripRequestResponse, "journeys"> {
    journeys: TPJourney[];
}

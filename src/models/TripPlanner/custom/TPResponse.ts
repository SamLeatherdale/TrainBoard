import { TripRequestResponse } from "../tripRequestResponse";

import { TPJourney } from "./TPJourney";

export interface TPResponse extends TripRequestResponse {
    journeys: TPJourney[];
}
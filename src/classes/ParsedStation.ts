import { TripRequestResponseJourneyLegStop } from "../models/TripPlanner/tripRequestResponseJourneyLegStop";

export default class ParsedStation {
    public platform = "";
    public station = "";
    protected parseSuccess = false;

    constructor(stop: TripRequestResponseJourneyLegStop) {
        const pattern = /(?:.*,\s*)?(.+) Station,\s*Platform (\d+)/;
        const results = pattern.exec(stop.name);
        if (results) {
            if (results.length >= 1) {
                this.station = results[1];
            }
            if (results.length >= 2) {
                this.platform = results[2];
                this.parseSuccess = true;
            }
        }
    }

    isParseSuccess() {
        return this.parseSuccess;
    }
}

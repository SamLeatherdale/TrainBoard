import {StopFinderLocation} from "../models/TripPlanner/stopFinderLocation";

export default class SettingsSet {
    public fromStop?: StopFinderLocation;
    public toStop?: StopFinderLocation;
    public walkTimeRange: [number, number] = [8,10];
    public apiKey = "";
    public proxyServer = "http://localhost:8010";

    public maps = {
        enabled: false,
        apiKey: ""
    };

    public reminders = {
        enabled: false,
        title: "",
        itemList: [] as string[]
    };

    public developer = {
        mapDebug: false
    };

    constructor(params: {[key: string]: any}) {
        const keys = Object.keys(params);
        for (let key of Object.keys(this)) {
            if (keys.includes(key)) {
                this[key] = params[key];
            }
        }
    }

    isConfiguredTrip() {
        return this.fromStop && this.toStop;
    }

    getConfiguredTrip(): undefined |
        {from: StopFinderLocation, to: StopFinderLocation} {
        if (!this.isConfiguredTrip()) {
            return undefined;
        }

        return {
            from: this.fromStop as StopFinderLocation,
            to: this.toStop as StopFinderLocation
        };
    }
}
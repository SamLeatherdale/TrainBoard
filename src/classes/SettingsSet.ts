import {StopFinderLocation} from "../models/TripPlanner/stopFinderLocation";

export default class SettingsSet {
    static readonly STORAGE_KEY = "appSettings";

    public fromStop?: StopFinderLocation;
    public toStop?: StopFinderLocation;
    public walkTimeRange: [number, number] = [8,10];
    public tripCount = 6;
    public apiKey = "OOtMuUcfZU5rsvDZlGrVqFl8vJDGMVybeuDS"; // Default public API key
    public proxyServer = "https://cors-anywhere.trainboard.workers.dev/?";

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

    static readSettings() {
        let rawSettings;
        try {
            rawSettings = JSON.parse(window.localStorage.getItem(SettingsSet.STORAGE_KEY) || "");
        } catch (e) {
            rawSettings = {};
        }

        return new SettingsSet(rawSettings);
    }

    static writeSettings(settings: SettingsSet) {
        window.localStorage.setItem(SettingsSet.STORAGE_KEY, JSON.stringify(settings));
    }

    static resetSettings() {
        SettingsSet.writeSettings(new SettingsSet());
    }

    constructor(params?: {[key: string]: any}) {
        if (!params) {
            return;
        }
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
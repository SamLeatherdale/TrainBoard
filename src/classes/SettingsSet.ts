import {StopFinderLocation} from "../models/TripPlanner/stopFinderLocation";
import APIClient from "./APIClient";

class SettingsSetCore {
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
}

class SettingsSetImport extends SettingsSetCore {
    public fromStopName?: string;
    public toStopName?: string;
}

export default class SettingsSet extends SettingsSetCore {
    static readonly STORAGE_KEY = "appSettings";

    public fromStop?: StopFinderLocation;
    public toStop?: StopFinderLocation;

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

    protected static fetchRemoteSettings(url: string, proxy?: string): Promise<any> {
        return fetch(url).catch((e) => {
            if (!proxy) {
                throw e;
            }
            // If CORS fails, try with the proxy
            return fetch(APIClient.getProxiedUrl(proxy, url));
        }).then((res) => {
            if (!res.ok) {
                throw new Error(`Failed to load remote settings: ${res.status} ${res.statusText}`)
            }
            return res.json();
        });
    }

    static async loadRemoteSettings(url: string, currentSettings: SettingsSet): Promise<SettingsSet> {
        const json: SettingsSetImport = await SettingsSet.fetchRemoteSettings(url, currentSettings.proxyServer);
        const settings = new SettingsSet(json);

        const {
            fromStopName,
            toStopName
        } = json;
        const {
            apiKey,
            proxyServer
        } = {
            ...currentSettings,
            ...json
        };

        const importMap = {
            'fromStop': fromStopName,
            'toStop': toStopName
        };
        const client = new APIClient(apiKey, proxyServer);
        for (const [key, query] of Object.entries(importMap)) {
            if (!query) {
                continue;
            }
            try {
                const locations = await client.getTrainStops(query);
                if (locations && locations.length) {
                    settings[key] = locations[0];
                }
            } catch (e) {
                // Ignore
            }
        }

        return settings;
    }

    constructor(params?: {[key: string]: any}) {
        super();
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
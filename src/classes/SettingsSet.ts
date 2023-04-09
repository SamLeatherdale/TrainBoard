import { StopFinderLocation } from "../models/TripPlanner/stopFinderLocation";

import APIClient from "./APIClient";

class SettingsSetCore {
    public walkTime: number = 10;
    public tripCount = 6;

    public maps = {
        enabled: false,
        apiKey: "",
    };

    public reminders = {
        enabled: false,
        title: "",
        itemList: [] as string[],
    };
}
interface SettingsSetImport extends SettingsSetCore {
    fromStopName?: string;
    toStopName?: string;
}

export default class SettingsSet extends SettingsSetCore {
    static readonly STORAGE_KEY = "appSettings";

    public fromStop?: StopFinderLocation = undefined;
    public toStop?: StopFinderLocation = undefined;

    static readSettings() {
        let rawSettings;
        try {
            rawSettings = JSON.parse(window.localStorage.getItem(SettingsSet.STORAGE_KEY) || "");
            console.log(rawSettings);
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

    protected static fetchRemoteSettings(url: string): Promise<any> {
        return fetch(url)
            .catch(() => {
                // If CORS fails, try with the proxy
                return fetch(APIClient.getProxiedUrl(url));
            })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(
                        `Failed to load remote settings: ${res.status} ${res.statusText}`
                    );
                }
                return res.json();
            });
    }

    static async loadRemoteSettings(
        url: string,
        currentSettings: SettingsSet
    ): Promise<SettingsSet> {
        const json: SettingsSetImport = await SettingsSet.fetchRemoteSettings(url);
        const settings = new SettingsSet(json);

        const { fromStopName, toStopName } = json;

        const importMap = {
            fromStop: fromStopName,
            toStop: toStopName,
        };
        const client = new APIClient();
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

    constructor(params?: Record<string, any>) {
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

    isConfiguredTrip(): boolean {
        return !!(this.fromStop && this.toStop);
    }

    getConfiguredTrip(): undefined | { from: StopFinderLocation; to: StopFinderLocation } {
        if (!this.isConfiguredTrip()) {
            return undefined;
        }

        return {
            from: this.fromStop as StopFinderLocation,
            to: this.toStop as StopFinderLocation,
        };
    }
}

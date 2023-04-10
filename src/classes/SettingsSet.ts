import { PaletteMode } from "@mui/material";

import { StopFinderLocation } from "../models/TripPlanner/stopFinderLocation";

import APIClient from "./APIClient";
import { TransportModeId } from "./LineType";

interface SettingsSetCore {
    theme: PaletteMode;
    walkTime: number;
    tripCount: number;
    mapsEnabled: boolean;
    burnInProtection: boolean;
    excludedModes: TransportModeId[];
}
interface SettingsSetImport extends SettingsSetCore {
    fromStopName?: string;
    toStopName?: string;
}

export interface SettingsSet extends SettingsSetCore {
    fromStop?: StopFinderLocation;
    toStop?: StopFinderLocation;
}

export interface BurnInProtection {
    top: number;
    left: number;
}

const defaultSettings: SettingsSet = {
    theme: "dark",
    walkTime: 10,
    tripCount: 6,
    mapsEnabled: false,
    burnInProtection: false,
    excludedModes: [],
};

export default class SettingsManager {
    static readonly STORAGE_KEY = "appSettings";

    static readSettings(): SettingsSet {
        let rawSettings;
        try {
            rawSettings = JSON.parse(
                window.localStorage.getItem(SettingsManager.STORAGE_KEY) || ""
            );
            console.log(rawSettings);
        } catch (e) {
            rawSettings = {};
        }

        return {
            ...defaultSettings,
            ...rawSettings,
        };
    }

    static writeSettings(settings: SettingsSet | {}) {
        window.localStorage.setItem(SettingsManager.STORAGE_KEY, JSON.stringify(settings));
    }

    static resetSettings() {
        SettingsManager.writeSettings({});
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
        currentSettings: SettingsManager
    ): Promise<SettingsSet> {
        const json: SettingsSetImport = await SettingsManager.fetchRemoteSettings(url);
        const settings = {
            ...defaultSettings,
        };

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
                const locations = await client.getStopsByMode(query, settings.excludedModes);
                if (locations && locations.length) {
                    settings[key] = locations[0];
                }
            } catch (e) {
                // Ignore
            }
        }

        return settings;
    }

    static isConfiguredTrip(settings: SettingsSet): boolean {
        return !!(settings.fromStop && settings.toStop);
    }

    static getConfiguredTrip(
        settings: SettingsSet
    ): undefined | { from: StopFinderLocation; to: StopFinderLocation } {
        if (!SettingsManager.isConfiguredTrip(settings)) {
            return undefined;
        }

        return {
            from: settings.fromStop as StopFinderLocation,
            to: settings.toStop as StopFinderLocation,
        };
    }
}

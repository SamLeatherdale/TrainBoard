import { TripRequestResponseJourneyLegStop } from "../models/TripPlanner/tripRequestResponseJourneyLegStop";

export default class ParsedStation {
    public platform = "";
    public station = "";
    protected parseSuccess = true;

    constructor(stop: TripRequestResponseJourneyLegStop) {
        const { name, disassembledName } = stop;
        const disNameParts = (disassembledName || name).split(", ");
        const station = disNameParts[0];
        let platform = disNameParts.length > 1 ? disNameParts[1] : "";
        if (!platform) {
            const parts = name.split(", ");
            platform = parts[parts.length - 1];
            if (platform === station) {
                platform = "";
            }
        }
        this.platform = getPlatformName(platform) || platform;
        this.station = formatStationName(station);
    }

    isParseSuccess() {
        return !!this.platform;
    }
}

export function shortenName(name: string): string {
    const parts = name.split(/, ?/);
    const uniqueParts = parts.filter((item, index) => parts.indexOf(item) === index);
    const filteredParts = uniqueParts.filter((item, index) => {
        for (let i = 0; i < index; i++) {
            if (uniqueParts[i].includes(item)) {
                return false;
            }
        }
        return true;
    });
    return filteredParts.join(", ");
}

function formatStationName(name: string, clean: boolean = false): string {
    let replaced = shortenName(name).replace(/ Station/, "");
    Object.entries(platformNames).forEach(([key, value]) => {
        replaced = replaced.replace(new RegExp(`${key}\\s+(\\w+)`), clean ? "" : value);
    });
    return replaced.trim().replace(/,$/, "");
}
const platformNames = {
    Platform: "P$1",
    Wharf: "W$1",
    Stand: "$1",
    Side: "$1",
};
function getPlatformName(name: string): string {
    const names = Object.entries(platformNames)
        .map(([key, value]) => getPlatformPart(name, key, value))
        .filter((item) => item !== null);
    return names.length > 0 ? names.join("/") : "";
}

function getPlatformPart(name: string, search: string, replace: string): string | null {
    const found = new RegExp(`${search}\\s+(\\w+)`, "i").exec(name);
    if (found !== null) {
        return found[1].replace(/^(.+)$/, replace);
    }
    return null;
}

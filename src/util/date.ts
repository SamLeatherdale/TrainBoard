import { blue, green, red } from "@mui/material/colors";
import orange from "@mui/material/colors/orange";
import { differenceInMinutes, formatDistanceStrict } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";

const TIMEZONE_SYDNEY = "Australia/Sydney";
export const LOCALE = "en-AU";
export const TIMEZONE = TIMEZONE_SYDNEY;

export function parseLocalDateTime(date?: string): Date {
    return utcToZonedTime(date || new Date(), TIMEZONE);
}

export function formatShortTime(date: Date): string {
    return new Intl.DateTimeFormat(LOCALE, {
        timeStyle: "short",
    }).format(date);
}

export default parseLocalDateTime;

export function getPlannedEstimatedDiff(planned: Date, estimated: Date) {
    const minsLate = differenceInMinutes(estimated, planned, { roundingMethod: "floor" });

    if (minsLate === 0) {
        return {
            label: "On time",
            color: green[500],
        };
    } else if (minsLate > 0) {
        return {
            label: `${minsLate} minutes late`,
            color: red[600],
        };
    } else {
        return {
            label: `${Math.abs(minsLate)} minutes early`,
            color: blue[500],
        };
    }
}

export function getRelativeFriendlyTime(time: Date, to: Date = new Date(), prefix = "") {
    if (differenceInMinutes(time, to, { roundingMethod: "floor" }) === 0) {
        return "now";
    }
    return (
        prefix +
        formatDistanceStrict(time, to, { roundingMethod: "floor" })
            .replace("minute", "min")
            .replace("hour", "hr")
    );
}

export function getDepartureTimeClass(walkTime: number, time: Date) {
    const diffMinutes = differenceInMinutes(time, new Date(), { roundingMethod: "floor" });

    if (diffMinutes > walkTime) {
        return green[700];
    } else if (diffMinutes < walkTime) {
        return red[600];
    } else {
        return orange[500];
    }
}

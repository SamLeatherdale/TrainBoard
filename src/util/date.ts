import { utcToZonedTime } from "date-fns-tz";

const TIMEZONE_SYDNEY = "Australia/Sydney";
const LOCALE = "en-AU";
export const TIMEZONE = TIMEZONE_SYDNEY;

export function parseLocalDateTime(date?: string): Date {
    return utcToZonedTime(date || new Date(), TIMEZONE);
}

export function formatMediumTime(date: Date): string {
    return new Intl.DateTimeFormat(LOCALE, {
        timeStyle: "medium",
    }).format(date);
}

export function formatShortTime(date: Date): string {
    return new Intl.DateTimeFormat(LOCALE, {
        timeStyle: "short",
    }).format(date);
}

export default parseLocalDateTime;

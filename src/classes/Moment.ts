import moment from "moment-timezone";
import { Moment as MomentAlias } from "moment-timezone/moment-timezone";

// Let's reexport so we have a global alias
export type Moment = MomentAlias;

const TIMEZONE_SYDNEY = "Australia/Sydney";
export const TIMEZONE = TIMEZONE_SYDNEY;

export default function createMomentTz(...args): Moment {
    const m = moment(...args);
    return convertTz(m);
}
function convertTz(m: Moment): Moment {
    return m.tz(TIMEZONE);
}
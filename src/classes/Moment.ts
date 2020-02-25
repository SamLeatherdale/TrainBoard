import moment from "moment-timezone";
import { Moment } from "moment-timezone/moment-timezone";

const TIMEZONE_SYDNEY = "Australia/Sydney";
export const TIMEZONE = TIMEZONE_SYDNEY;

function createMomentTz(...args): Moment {
    const m = moment(...args);
    return convertTz(m);
}
function convertTz(m: Moment): Moment {
    return m.tz(TIMEZONE);
}

export default createMomentTz;
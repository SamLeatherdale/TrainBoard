export const COLOR_PRIMARY = "#f18500";

export function tryParseInt(value: string, def = 0) {
    const int = parseInt(value);
    return isNaN(int) ? def : int;
}
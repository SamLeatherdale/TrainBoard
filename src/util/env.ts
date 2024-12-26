export function isDev(): boolean {
    return !!import.meta.env.DEV;
}
export function getMapsApiKey(): string {
    return import.meta.env.VITE_MAPS_API_KEY;
}

export function getDevApi(): boolean {
    return import.meta.env.VITE_USE_DEV_API === "true";
}

export function isDev(): boolean {
    // @ts-expect-error
    return !!import.meta.env.DEV;
}
export function getMapsApiKey(): string {
    // @ts-expect-error
    return import.meta.env.VITE_MAPS_API_KEY;
}

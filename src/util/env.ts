export function isDev(): boolean {
    // @ts-expect-error
    return !!import.meta.env.DEV;
}

export enum CancelStatus {
    CANCELLED = "CANCELLED",
    SKIPPED = "SKIPPED",
}

export function getCancelStatus(
    isCancelled: boolean,
    isSkipped: boolean
): CancelStatus | undefined {
    if (isCancelled) {
        return CancelStatus.CANCELLED;
    }
    if (isSkipped) {
        return CancelStatus.SKIPPED;
    }
    return undefined;
}

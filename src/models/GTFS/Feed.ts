export interface FeedMessage<T extends FeedEntity> {
    entity: T[],
    header: FeedHeader
}

export interface FeedHeader {
    gtfsRealtimeVersion: string;
    incrementality: number
    timestamp: number;
}

export interface FeedEntity {
    id: string;
}
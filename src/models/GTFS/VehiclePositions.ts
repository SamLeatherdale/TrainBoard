import ParsedTripId from "../../classes/ParsedTripId";
import {FeedEntity} from "./Feed";

export interface VehiclePositionEntity extends FeedEntity {
    vehicle: VehiclePosition
}

export interface ParsedVehiclePositionEntity extends VehiclePositionEntity {
    parsedTripId: ParsedTripId
}

export interface VehiclePosition {
    trip: TripDescriptor
    position: VehicleCoords
    timestamp: number
    congestionLevel: number
    stopId: string
    vehicle: VehicleDescriptor
}

export interface TripDescriptor {
    tripId: string;
    scheduleRelationship: number
    routeId: string;
}

export interface VehicleCoords {
    latitude: number;
    longitude: number;
}

export interface VehicleDescriptor {
    id: string;
    label?: string;
}
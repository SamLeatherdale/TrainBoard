//Some types adapted from https://github.com/toast-studio/tfnsw-trip-planner/

import { TransportModeId } from "./LineType";

export interface LatLng {
    lat: number;
    lng: number;
}

export enum TPStopType {
    Any = "any",
    Coord = "coord",
    Poi = "poi",
    Stop = "stop",
}

export enum TPLocationType {
    Any = "any",
    Coord = "coord",
    Poi = "poi",
    Stop = "stop",
    Street = "street",
    Suburb = "suburb",
    Locality = "locality",
}

export enum TPCoordOutputFormat {
    EPSG_4326 = "EPSG:4326",
}

export type SimpleCoords = [number, number];

export type RealtimeRequest = {
	mode: TransportModeId;
	id: string;
	operator: string;
};

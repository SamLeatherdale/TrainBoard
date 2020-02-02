//Some types adapted from https://github.com/toast-studio/tfnsw-trip-planner/

export type TPError = {
    message: string
    versions: {
        controller: string
        interfaceMax: string
        interfaceMin: string
    }
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
    EPSG_4326 = "EPSG:4326"
}
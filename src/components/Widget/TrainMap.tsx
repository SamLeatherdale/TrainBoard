// TODO: Remove after completing map implementation
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";

import { COLOR_PRIMARY } from "../../classes/functions";
import { SettingsSet } from "../../classes/SettingsSet";
import { LatLng, SimpleCoords } from "../../classes/types";
import { ParsedVehiclePositionEntity, VehicleCoords } from "../../models/GTFS/VehiclePositions";
import { TripRequestResponseJourney } from "../../models/TripPlanner/tripRequestResponseJourney";
import { getMapsApiKey } from "../../util/env";

import TrainMapMarker from "./TrainMapMarker";

interface TrainMapProps {
    settings: SettingsSet;
    trips: TripRequestResponseJourney[];
    realtimeTripData: ParsedVehiclePositionEntity[];
}

function simpleCoordsToLatLng(coords: SimpleCoords): LatLng {
    return {
        lat: coords[0],
        lng: coords[1],
    };
}

function vehicleCoordsToLatLng(coords: VehicleCoords): LatLng {
    return {
        lat: coords.latitude,
        lng: coords.longitude,
    };
}

function getAverageLatLng(a: LatLng, b: LatLng): LatLng {
    return {
        lat: (a.lat + b.lat) / 2,
        lng: (a.lng + b.lng) / 2,
    };
}

function GoogleMap(_: Record<string, unknown>) {
    return <div></div>;
}

export default function TrainMap(props: TrainMapProps) {
    const { trips, settings, realtimeTripData } = props;
    const { mapsEnabled } = settings;
    if (!mapsEnabled || !trips.length) {
        return null;
    }

    const legs = trips[0].legs;
    const first = legs[0];
    const last = legs[legs.length - 1];
    const from = first.origin;
    const to = last.destination;
    const fromLatLng = simpleCoordsToLatLng(from.coord);
    const toLatLng = simpleCoordsToLatLng(to.coord);
    const averageLatLng = getAverageLatLng(fromLatLng, toLatLng);

    return (
        <>
            <div id="bg-google-maps">
                <GoogleMap
                    bootstrapURLKeys={{ key: getMapsApiKey() }}
                    defaultCenter={fromLatLng}
                    zoom={12}
                    options={{
                        disableDefaultUI: true,
                        styles: [
                            {
                                featureType: "poi",
                                elementType: "all",
                                stylers: [{ visibility: "off" }],
                            },
                            {
                                featureType: "administrative",
                                elementType: "all",
                                stylers: [{ visibility: "on" }],
                            },
                            {
                                featureType: "transit.line",
                                elementType: "geometry.fill",
                                stylers: [
                                    { visibility: "on" },
                                    { color: COLOR_PRIMARY },
                                    { weight: 5 },
                                ],
                            },
                            {
                                featureType: "transit.station",
                                elementType: "labels.text.stroke",
                                stylers: [
                                    { visibility: "on" },
                                    { color: COLOR_PRIMARY },
                                    { weight: 50 },
                                ],
                            },
                            {
                                featureType: "transit.station",
                                elementType: "labels.text.fill",
                                stylers: [{ visibility: "on" }],
                            },
                            {
                                featureType: "transit.station",
                                elementType: "labels.icon",
                                stylers: [
                                    { visibility: "on" },
                                    { color: COLOR_PRIMARY },
                                    { weight: 50 },
                                ],
                            },
                            {
                                featureType: "road",
                                elementType: "all",
                                stylers: [{ visibility: "off" }],
                            },
                            {
                                featureType: "road.highway",
                                elementType: "geometry",
                                stylers: [{ visibility: "on" }],
                            },
                        ],
                    }}
                >
                    {realtimeTripData.map((entity, i) => {
                        const fromTo = /\d+:\d+ (.+) Station to (.+) Station/i.exec(
                            entity.vehicle.vehicle.label || ""
                        );
                        let to = "";
                        if (fromTo && fromTo.length > 1) {
                            to = fromTo[2].slice(0, 3).toUpperCase();
                        }

                        return (
                            <TrainMapMarker
                                key={i}
                                label={to || i.toString()}
                                {...vehicleCoordsToLatLng(entity.vehicle.position)}
                            />
                        );
                    })}
                </GoogleMap>
            </div>
            <div id="bg-google-maps-overlay" />
        </>
    );
}

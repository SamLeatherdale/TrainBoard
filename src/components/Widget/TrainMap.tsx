import GoogleMap from "google-map-react";
import React from "react";
import {COLOR_PRIMARY} from "../../classes/functions";
import SettingsSet from "../../classes/SettingsSet";
import {LatLng, SimpleCoords} from "../../classes/types";
import {ParsedVehiclePositionEntity, VehicleCoords} from "../../models/GTFS/VehiclePositions";
import {TripRequestResponseJourney} from "../../models/TripPlanner/tripRequestResponseJourney";
import TrainMapMarker from "./TrainMapMarker";

interface TrainMapProps {
    settings: SettingsSet
    trips: TripRequestResponseJourney[]
    realtimeTripData: ParsedVehiclePositionEntity[]
}

function simpleCoordsToLatLng(coords: SimpleCoords): LatLng {
    return {
        lat: coords[0],
        lng: coords[1]
    }
}

function vehicleCoordsToLatLng(coords: VehicleCoords): LatLng {
    return {
        lat: coords.latitude,
        lng: coords.longitude
    }
}

function getAverageLatLng(a: LatLng, b: LatLng): LatLng {
    return {
        lat: (a.lat + b.lat) / 2,
        lng: (a.lng + b.lng) / 2
    }
}

function TrainMap(props: TrainMapProps) {
    const {trips, settings, realtimeTripData} = props;
    if (!settings.maps.enabled || (!settings.maps.apiKey && process.env.NODE_ENV === 'production') || !trips.length) {
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
                    bootstrapURLKeys={{key: settings.maps.apiKey}}
                    defaultCenter={fromLatLng}
                    defaultZoom={12}
                    options={{
                        disableDefaultUI: true,
                        styles: [{
                            featureType: "poi",
                            elementType: "all",
                            stylers: [
                                {visibility: "off"},
                            ]
                        }, {
                            featureType: "administrative",
                            elementType: "all",
                            stylers: [
                                {visibility: "off"},
                            ]
                        }, {
                            featureType: "transit.line",
                            elementType: "geometry.fill",
                            stylers: [
                                {visibility: "on"},
                                {color: COLOR_PRIMARY},
                                {weight: 5},
                            ]
                        }, {
                            featureType: "transit.station",
                            elementType: "labels.text.stroke",
                            stylers: [
                                //{visibility: "on"},
                                //{color: COLOR_PRIMARY},
                                {weight: 50},
                            ]
                        }, {
                            featureType: "transit.station",
                            elementType: "labels.icon",
                            stylers: [
                                //{visibility: "on"},
                                //{color: COLOR_PRIMARY},
                                {weight: 50},
                            ]
                        }, {
                            featureType: "road",
                            elementType: "all",
                            stylers: [
                                {visibility: "off"},
                            ]
                        }, {
                            featureType: "road.highway",
                            elementType: "all",
                            stylers: [
                                {visibility: "on"},
                            ]
                        }]
                    }}
                >
                    {realtimeTripData.map((entity, i) => (
                        <TrainMapMarker
                            key={i}
                            label={i.toString()}
                            {...vehicleCoordsToLatLng(entity.vehicle.position)}
                        />
                    ))}
                </GoogleMap>
            </div>
            <div id="bg-google-maps-overlay" hidden={settings.developer.mapDebug} />
        </>
    )
};

export default TrainMap;
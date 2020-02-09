import GoogleMapReact, {Coords} from "google-map-react";
import React from "react";
import SettingsSet from "../../classes/SettingsSet";
import {SimpleCoords} from "../../classes/types";
import {ParsedVehiclePositionEntity} from "../../models/GTFS/VehiclePositions";
import {TripRequestResponseJourney} from "../../models/TripPlanner/tripRequestResponseJourney";
import AutoBoundComponent from "../AutoBoundComponent";
import TrainMapMarker from "./TrainMapMarker";

interface TrainMapProps {
    settings: SettingsSet
    trips: TripRequestResponseJourney[]
    realtimeTripData: ParsedVehiclePositionEntity[]
}

function getGoogleMapCoords(coords: SimpleCoords): Coords {
    return {
        lat: coords[0],
        lng: coords[1]
    }
}

export default class TrainMap extends AutoBoundComponent<TrainMapProps, {}> {
    render() {
        const {trips, settings} = this.props;
        if (!settings.maps.enabled || (!settings.maps.apiKey && process.env.NODE_ENV === 'production') || !trips.length) {
            return null;
        }
        const from = trips[0].legs[0].origin;
        const gCoords = getGoogleMapCoords(from.coord);

        return (
            <>
                <div id="bg-google-maps">
                    <GoogleMapReact
                        bootstrapURLKeys={{key: settings.maps.apiKey}}
                        defaultCenter={gCoords}
                        defaultZoom={12}
                    >
                        {this.props.realtimeTripData.map((entity, i) => (
                            <TrainMapMarker
                                key={i}
                                text={i.toString()}
                                lat={entity.vehicle.position.latitude}
                                lng={entity.vehicle.position.longitude}
                            />
                        ))}
                    </GoogleMapReact>
                </div>
                <div id="bg-google-maps-overlay" />
            </>
        )
    }
}
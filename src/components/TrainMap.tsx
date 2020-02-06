import autoBind from "auto-bind";
import GoogleMapReact, {Coords} from "google-map-react";
import React from "react";
import SettingsSet from "../classes/SettingsSet";
import {SimpleCoords} from "../classes/types";
import {TripRequestResponseJourney} from "../models/TripPlanner/tripRequestResponseJourney";

interface TrainMapProps {
    settings: SettingsSet
    trips: TripRequestResponseJourney[]
}

function getGoogleMapCoords(coords: SimpleCoords): Coords {
    return {
        lat: coords[0],
        lng: coords[1]
    }
}

export default class TrainMap extends React.Component<TrainMapProps, {}> {
    constructor(props) {
        super(props);
        autoBind.react(this);
    }

    render() {
        const {trips, settings} = this.props;
        if (!trips.length) {
            return null;
        }
        const from = trips[0].legs[0].origin;
        const gCoords = getGoogleMapCoords(from.coord);

        return (
            <>
                <div id="bg-google-maps">
                    <GoogleMapReact
                        bootstrapURLKeys={{key: settings.mapsApiKey}}
                        defaultCenter={gCoords}
                        defaultZoom={11}
                    >
                    </GoogleMapReact>
                </div>
                <div id="bg-google-maps-overlay" />
            </>
        )
    }
}
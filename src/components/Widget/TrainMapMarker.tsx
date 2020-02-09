import React from "react";
import TrainIcon from "@material-ui/icons/Train";
import {Coords} from "google-map-react";

interface TrainMapMarkerProps extends Coords {
    text: string;
}

export default function TrainMapMarker(props: TrainMapMarkerProps) {
    return (
        <TrainIcon />
    )
}
import React from "react";
import TrainIcon from "@material-ui/icons/Train";
import {LatLng} from "../../classes/types";

interface TrainMapMarkerProps extends LatLng {
    label: string;
}

export default function TrainMapMarker(props: TrainMapMarkerProps) {
    const {label} = props;
    return (
        <div className="train-map-marker">
            <div className="train-map-marker-icon">
                <TrainIcon />
            </div>
            <span>{label}</span>
        </div>
    )
}
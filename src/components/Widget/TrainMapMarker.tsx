import React from "react";
import TrainIcon from "@material-ui/icons/Train";
import {LatLng} from "../../classes/types";

interface TrainMapMarkerProps extends LatLng {
    label: string;
}

export default function TrainMapMarker(props: TrainMapMarkerProps) {
    const {label} = props;
    return (
        <div>
            <TrainIcon />
            {label}
        </div>
    )
}
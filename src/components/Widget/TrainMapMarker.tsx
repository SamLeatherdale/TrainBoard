import React from "react";

import TrainIcon from "@mui/icons-material/Train";
import Chip from "@mui/material/Chip";
import { styled } from "@mui/material/styles";

import { LatLng } from "../../classes/types";

interface TrainMapMarkerProps extends LatLng {
    label: string;
}

export default function TrainMapMarker(props: TrainMapMarkerProps) {
    const { label } = props;
    return (
        <Marker>
            <MarkerIcon>
                <TrainIcon fontSize="small" color="primary" />
            </MarkerIcon>
            <Chip label={label} size="small" color="primary" />
        </Marker>
    );
}

const Marker = styled("div")`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    transform: translateX(-50%) translateY(-50%);
`;
const MarkerIcon = styled("div")`
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: white;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 1px solid black;
`;

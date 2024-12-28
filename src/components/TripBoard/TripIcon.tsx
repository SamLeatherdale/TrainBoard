import React from "react";

import {
    getLineType,
    getTransportMode,
    TransportMode,
    TransportModeId,
    transportModes,
} from "../../classes/LineType";
import { TPLeg } from "../../models/TripPlanner/custom/TPLeg";
import InfoChip from "../InfoChip";

export function TripIcon({ leg }: { leg: TPLeg }) {
    const tripName = leg.transportation?.disassembledName?.toUpperCase();
    const transportMode = getTransportMode(leg.transportation?.product?.iconId);

    const isTrain = transportMode?.id === TransportModeId.Train;
    let color = transportModes[TransportModeId.Walk].color;
    if (isTrain && tripName) {
        color = getLineType(tripName).color;
    } else if (transportMode && tripName) {
        color = transportMode.color;
    } else if (transportMode) {
        return <TransportModeIcon mode={transportMode} />;
    }
    return <InfoChip label={tripName} sx={{ backgroundColor: color }} />;
}

export function TransportModeIcon({ mode }: { mode: TransportMode }) {
    const Icon = mode.icon;
    return (
        <Icon
            style={{
                width: "1.5em",
                height: "1.5em",
            }}
        />
    );
}

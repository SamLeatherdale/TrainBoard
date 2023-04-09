import React, { Fragment } from "react";

import { Box, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";

import { getTransportMode } from "../../classes/LineType";
import ParsedStation from "../../classes/ParsedStation";
import { TripRequestResponseJourneyLeg } from "../../models/TripPlanner/tripRequestResponseJourneyLeg";
import { TripRequestResponseJourneyLegStop } from "../../models/TripPlanner/tripRequestResponseJourneyLegStop";
import InfoChip from "../InfoChip";

import { TripIcon } from "./TripIcon";

export default function TripLabel({
    legs,
    all = true,
}: {
    legs: TripRequestResponseJourneyLeg[];
    all: boolean;
}) {
    let showLegs: TripRequestResponseJourneyLeg[];

    if (all) {
        showLegs = [...legs].slice(0, 2);
        showLegs.push(legs[legs.length - 1]);
    } else {
        const first = legs[0];
        const last = legs[legs.length - 1];
        showLegs = [first, last];
    }

    // Add the final one on again as destination
    return (
        <Box
            sx={{
                position: "relative",
                zIndex: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1,
                span: {
                    whiteSpace: "nowrap",
                },
            }}
        >
            <DottedLine />
            {showLegs.map((leg, i) => {
                const transportMode = getTransportMode(leg.transportation?.product?.iconId);
                const isLast = i === showLegs.length - 1;
                const station: TripRequestResponseJourneyLegStop = isLast
                    ? leg.destination
                    : leg.origin;
                const parsedStation = new ParsedStation(station);
                const lineName = leg.transportation?.disassembledName;

                let stationName = station.disassembledName || station.name;

                if (parsedStation.isParseSuccess()) {
                    stationName = parsedStation.station;
                } else if (stationName && stationName.length > 25) {
                    stationName = stationName.substring(0, 25) + "...";
                }

                return (
                    <Fragment key={`fragment-${i}`}>
                        <Stop elevation={1}>
                            <span>{stationName}</span>
                            {parsedStation.isParseSuccess() && (
                                <InfoChip
                                    sx={{ ml: 1 }}
                                    variant="outlined"
                                    label={parsedStation.platform}
                                />
                            )}
                        </Stop>
                        {!isLast && <TripIcon leg={leg} />}
                    </Fragment>
                );
            })}
        </Box>
    );
}

const DottedLine = styled("div")((props) => ({
    border: "3px dashed white",
    position: "absolute",
    width: "calc(100% - 8px)",
    zIndex: -1,
}));
const Stop = styled(Paper)((props) => ({
    display: "flex",
    alignItems: "center",
    padding: "0 8px",
    boxShadow: "none",
}));

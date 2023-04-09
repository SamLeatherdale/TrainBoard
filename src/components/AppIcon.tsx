import React from "react";

import AirPlayIcon from "@mui/icons-material/Airplay";
import TrainIcon from "@mui/icons-material/Train"

export default class AppIcon extends React.Component<{}, {}> {
    render() {
        return (
        <>
            <div id='AppIcon'>
                <div className={'icon-container'}>
                    <AirPlayIcon className={'airplay'}/>
                    <div className={'train'}>
                        <TrainIcon/>
                    </div>
                </div>
            </div>
        </>
        )
    }
}
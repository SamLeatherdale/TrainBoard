import React from "react";
import AirPlayIcon from "@material-ui/icons/Airplay";
import TrainIcon from "@material-ui/icons/Train"

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
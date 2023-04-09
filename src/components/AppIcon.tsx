import React from "react";

import AirPlayIcon from "@mui/icons-material/Airplay";
import TrainIcon from "@mui/icons-material/Train";

export default class AppIcon extends React.Component<{}, {}> {
    render() {
        return (
            <>
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
                />
                <div id="AppIcon">
                    <div className={"icon-container"}>
                        <AirPlayIcon className={"airplay"} />
                        <div className={"train"}>
                            <TrainIcon />
                        </div>
                    </div>
                </div>
                <br />
                <div id="AppIconTV">
                    <div className={"icon-container"}>
                        <AirPlayIcon className={"airplay"} />
                        <div className={"train"}>
                            <TrainIcon />
                        </div>
                    </div>
                    <p>TrainBoard</p>
                </div>
            </>
        );
    }
}

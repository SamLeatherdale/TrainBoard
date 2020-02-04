import autoBind from "auto-bind";
import React from "react";
import RefreshIcon from "@material-ui/icons/Refresh";
import {IconButton} from "@material-ui/core";
import {CountdownCircleTimer} from "react-countdown-circle-timer";

interface RefreshTimerProps {
    isRefreshing: boolean;
    durationSeconds: number;
    resetKey: number;
}

export default class RefreshTimer extends React.Component<RefreshTimerProps, {}>{
    constructor(props) {
        super(props);
        autoBind.react(this);
    }

    render() {
        return <div className="refresh-timer">{this.getContent()}</div>
    }

    getContent() {
        if (this.props.isRefreshing) {
            return (
                <IconButton>
                    <RefreshIcon />
                </IconButton>
            );
        }
        return (
            <CountdownCircleTimer
                ariaLabel={"countdownCircleWidget"}
                key={this.props.resetKey}
                isPlaying={true}
                durationSeconds={this.props.durationSeconds}
                colors={[['#ffffff', 0]]}
                trailColor={'#888888'}
            />
        )
    }
}
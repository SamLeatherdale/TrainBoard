import {IconButton} from "@material-ui/core";
import RefreshIcon from "@material-ui/icons/Refresh";
import React from "react";
import {CountdownCircleTimer} from "react-countdown-circle-timer";
import AutoBoundComponent from "./AutoBoundComponent";

interface RefreshTimerProps {
    isRefreshing: boolean;
    durationSeconds: number;
    resetKey: number;
}

export default class RefreshTimer extends AutoBoundComponent<RefreshTimerProps, {}>{
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
                duration={this.props.durationSeconds}
                colors={[['#ffffff', 0]]}
                trailColor={'#333'}
            />
        )
    }
}
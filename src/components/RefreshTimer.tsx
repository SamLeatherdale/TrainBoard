import React, { useEffect, useRef, useState } from "react";

import { CircularProgress } from "@mui/material";

interface RefreshTimerProps {
    isRefreshing: boolean;
    durationSeconds: number;
}

export default function RefreshTimer(props: RefreshTimerProps) {
    const { isRefreshing, durationSeconds } = props;
    const [startTime] = useState(new Date().getTime());
    const [progress, setProgress] = React.useState(0);
    const timerKey = useRef(0);
    const updateInterval = 200;
    function updateProgress() {
        const elapsed = new Date().getTime() - startTime;
        const newProgress = Math.min(100, (elapsed / (durationSeconds * 1000)) * 100);
        setProgress(newProgress);
        if (newProgress < 100) {
            timerKey.current = window.setTimeout(updateProgress, updateInterval);
        }
    }
    useEffect(() => {
        timerKey.current = window.setTimeout(updateProgress, updateInterval);
        return () => {
            window.clearTimeout(timerKey.current);
        };
    }, []);

    return (
        <div className="refresh-timer">
            <CircularProgress
                size={60}
                value={isRefreshing ? undefined : progress}
                variant={isRefreshing ? "indeterminate" : "determinate"}
            />
        </div>
    );
}

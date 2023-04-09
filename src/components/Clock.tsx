import React, { useEffect, useState } from "react";

import { Typography } from "@mui/material";

import { formatMediumTime } from "../util/date";

export default function Clock() {
    const [time, setTime] = useState(new Date().getTime());
    const timerKey = React.useRef(0);

    useEffect(() => {
        timerKey.current = window.setInterval(() => {
            setTime(new Date().getTime());
        }, 1000);
        return () => {
            window.clearInterval(timerKey.current);
        };
    });

    const timeString = formatMediumTime(new Date());

    return (
        <Typography variant="h6">
            <time>{timeString}</time>
        </Typography>
    );
}

import React, { useEffect, useState } from "react";

import { Typography } from "@mui/material";

import { LOCALE } from "../util/date";

function formatDateTime(date: Date): string {
    return new Intl.DateTimeFormat(LOCALE, {
        dateStyle: "medium",
        timeStyle: "medium",
    }).format(date);
}

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

    const timeString = formatDateTime(new Date());

    return (
        <Typography variant="body1">
            <time>{timeString}</time>
        </Typography>
    );
}

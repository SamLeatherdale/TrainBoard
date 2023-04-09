/// <reference types="vite-plugin-svgr/client" />

import { ReactComponent as bus } from "../images/bus.svg";
import { ReactComponent as coach } from "../images/coach.svg";
import { ReactComponent as ferry } from "../images/ferry.svg";
import { ReactComponent as lightRail } from "../images/lightrail.svg";
import { ReactComponent as metro } from "../images/metro.svg";
import { ReactComponent as schoolBus } from "../images/schoolbus.svg";
import { ReactComponent as train } from "../images/train.svg";
import { ReactComponent as walk } from "../images/walk.svg";

import { COLOR_PRIMARY } from "./functions";

interface LineType {
    color: string;
}
export interface TransportMode {
    id: TransportModeId;
    name: string;
    color: string;
    icon: typeof bus;
    isWalk?: boolean;
}

export enum TransportModeId {
    Train = 1,
    Metro = 2,
    LightRail = 4,
    Bus = 5,
    Coach = 7,
    Ferry = 9,
    SchoolBus = 11,
    Walk = 99,
    Walking = 100,
}

export const transportModes: Record<number, TransportMode> = {
    [TransportModeId.Metro.valueOf()]: {
        id: TransportModeId.Metro,
        name: "Metro",
        color: "#05969f",
        icon: metro,
    },
    [TransportModeId.Train.valueOf()]: {
        id: TransportModeId.Train,
        name: "Train",
        color: "#f79210",
        icon: train,
    },
    [TransportModeId.Bus.valueOf()]: {
        id: TransportModeId.Bus,
        name: "Bus",
        color: "#00b6f1",
        icon: bus,
    },
    [TransportModeId.LightRail.valueOf()]: {
        id: TransportModeId.LightRail,
        name: "Light Rail",
        color: "#e4032e",
        icon: lightRail,
    },
    [TransportModeId.Ferry.valueOf()]: {
        id: TransportModeId.Ferry,
        name: "Ferry",
        color: "#5ab131",
        icon: ferry,
    },
    [TransportModeId.Coach.valueOf()]: {
        id: TransportModeId.Coach,
        name: "Coach",
        color: "#f9d71c",
        icon: coach,
    },
    [TransportModeId.SchoolBus.valueOf()]: {
        id: TransportModeId.SchoolBus,
        name: "School Bus",
        color: "#f9d71c",
        icon: schoolBus,
    },
    [TransportModeId.Walk.valueOf()]: {
        id: TransportModeId.Walk,
        name: "Walk",
        color: "#444444",
        icon: walk,
        isWalk: true,
    },
    [TransportModeId.Walking.valueOf()]: {
        id: TransportModeId.Walking,
        name: "Walk",
        color: "#444444",
        icon: walk,
        isWalk: true,
    },
};

export function getTransportMode(id?: TransportModeId) {
    return id ? transportModes[id] : undefined;
}

const LineTypes = {
    M: {
        color: "#05969f",
    },
    T1: {
        color: "#f79210",
    },
    T2: {
        color: "#0798d2",
    },
    T3: {
        color: "#f35c19",
    },
    T4: {
        color: "#1f57a9",
    },
    T5: {
        color: "#c51191",
    },
    T7: {
        color: "#6a7d8b",
    },
    T8: {
        color: "#0b974a",
    },
    T9: {
        color: "#d31b2e",
    },
};

const LineTypeDefault: LineType = {
    color: COLOR_PRIMARY,
};

export function getLineType(type: string) {
    return LineTypes[type] || LineTypeDefault;
}

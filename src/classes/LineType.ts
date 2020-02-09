import {COLOR_PRIMARY} from "./functions";

interface LineType {
    color: string
}

const LineTypes = {
    "M": {
        color: "#05969f"
    },
    "T1": {
        color: "#f79210"
    },
    "T2": {
        color: "#0798d2"
    },
    "T3": {
        color: "#f35c19"
    },
    "T4": {
        color: "#1f57a9"
    },
    "T5": {
        color: "#c51191"
    },
    "T7": {
        color: "#6a7d8b"
    },
    "T8": {
        color: "#0b974a"
    },
    "T9": {
        color: "#d31b2e"
    }
};

const LineTypeDefault: LineType = {
    color: COLOR_PRIMARY
};

export function getLineType(type: string) {
    return LineTypes[type] || LineTypeDefault;
}
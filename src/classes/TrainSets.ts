import {TypedObj} from "./types";

export enum SetType {
    UNKNOWN = "",
    WARATAH = "A",
    C_SET = "C",
    OSCAR = "H",
    HUNTER = "J",
    K_SET = "K",
    MILLENIUM = "M",
    ENDEAVOUR = "N",
    XPLORER = "P",
    S_SET = "S",
    TANGARA = "T",
    V_SET = "V",
    XPT = "X",
    INDIAN_PACIFIC = "Z"
}

export interface TrainSet {
    name: string;
}

const TrainSets: TypedObj<TrainSet> = {
    [SetType.UNKNOWN]: {
        name: ""
    },
    [SetType.WARATAH]: {
        name: "Waratah"
    },
    [SetType.C_SET]: {
        name: "C Set"
    },
    [SetType.OSCAR]: {
        name: "OSCAR"
    },
    [SetType.HUNTER]: {
        name: "Hunter"
    },
    [SetType.K_SET]: {
        name: "K Set"
    },
    [SetType.MILLENIUM]: {
        name: "Millenium"
    },
    [SetType.ENDEAVOUR]: {
        name: "Endeavour"
    },
    [SetType.XPLORER]: {
        name: "Xplorer"
    },
    [SetType.S_SET]: {
        name: "S Set"
    },
    [SetType.TANGARA]: {
        name: "Tangara"
    },
    [SetType.V_SET]: {
        name: "V Set"
    },
    [SetType.XPT]: {
        name: "XPT"
    },
    [SetType.INDIAN_PACIFIC]: {
        name: "Indian Pacific"
    }
};
export default TrainSets;

export function getTrainSet(setType: SetType) {
    return TrainSets[setType] || TrainSets[SetType.UNKNOWN];
}
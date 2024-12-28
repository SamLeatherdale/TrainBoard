export enum SetType {
    UNKNOWN = "",
    WARATAH_A = "A",
    WARATAH_B = "B",
    C_SET = "C",
    D_SET = "D",
    OSCAR = "H",
    HUNTER = "J",
    K_SET = "K",
    MILLENNIUM = "M",
    ENDEAVOUR = "N",
    XPLORER = "P",
    S_SET = "S",
    TANGARA = "T",
    BUS = "U",
    V_SET = "V",
    XPT = "X",
    PRIVATE = "Z",
}

export interface TrainSet {
    name: string;
}

const TrainSets: Record<string, TrainSet> = {
    [SetType.UNKNOWN]: {
        name: "",
    },
    [SetType.WARATAH_A]: {
        name: "Waratah A",
    },
    [SetType.WARATAH_B]: {
        name: "Waratah B",
    },
    [SetType.C_SET]: {
        name: "C set",
    },
    [SetType.D_SET]: {
        name: "Mariyung (NIF)",
    },
    [SetType.OSCAR]: {
        name: "OSCAR",
    },
    [SetType.HUNTER]: {
        name: "Hunter",
    },
    [SetType.K_SET]: {
        name: "K set",
    },
    [SetType.MILLENNIUM]: {
        name: "Millennium",
    },
    [SetType.ENDEAVOUR]: {
        name: "Endeavour",
    },
    [SetType.XPLORER]: {
        name: "Xplorer",
    },
    [SetType.S_SET]: {
        name: "S set",
    },
    [SetType.TANGARA]: {
        name: "Tangara",
    },
    [SetType.BUS]: {
        name: "Bus",
    },
    [SetType.V_SET]: {
        name: "V set (Intercity)",
    },
    [SetType.XPT]: {
        name: "XPT",
    },
    [SetType.PRIVATE]: {
        name: "Private Passenger",
    },
};

export default TrainSets;

export function getTrainSet(setType: SetType) {
    return TrainSets[setType] || TrainSets[SetType.UNKNOWN];
}

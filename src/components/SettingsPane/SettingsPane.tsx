import { SettingsSet } from "../../classes/SettingsSet";

export type OnUpdateFunc = (key: keyof SettingsSet, value: any) => void;

export interface SettingsPaneProps {
    onUpdate: OnUpdateFunc;
    onReset: () => void;
    settings: SettingsSet;
}

export enum SettingsPane {
    GENERAL = "general",
    MODES = "modes",
    WIDGETS = "widgets",
}

import SettingsSet from "../../classes/SettingsSet";

export type OnUpdateFunc = (key: string, value: any, delta?: boolean) => void;

export interface SettingsPaneProps {
    onUpdate: OnUpdateFunc;
    onReset: () => void;
    settings: SettingsSet;
}

export enum SettingsPane {
    GENERAL = "general",
    MAPS = "maps",
    REMINDERS = "reminders",
    DEVELOPER = "developer",
}

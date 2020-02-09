import SettingsSet from "../../classes/SettingsSet";
import AutoBoundComponent from "../AutoBoundComponent";

export type OnUpdateFunc = (key: string, value: any) => void;

export interface SettingsPaneProps {
    onUpdate: OnUpdateFunc,
    settings: SettingsSet
}

export default abstract class SettingsPane extends AutoBoundComponent<SettingsPaneProps, {}>{
    onUpdateSetting(key: string, value: any) {
        this.props.onUpdate(key, value);
    }
}
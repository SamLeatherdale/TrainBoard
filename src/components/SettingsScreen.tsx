import React from "react";
import StopSearch from "./StopSearch";
import autoBind from "auto-bind";
import SettingsSet from "../classes/SettingsSet";

export interface SettingsScreenProps {
    settings: SettingsSet
    onUpdate: (key: string, value: any) => void
}

export default class SettingsScreen extends React.Component<SettingsScreenProps, {}> {
    constructor(props) {
        super(props);
        autoBind.react(this);
    }

    render() {
        return (
            <div>
                <StopSearch label="From"
                            value={this.props.settings.fromStop}
                            onSelect={(s) => this.onUpdateSetting("fromStop", s)} />
                <StopSearch label="To"
                            value={this.props.settings.toStop}
                            onSelect={(s) => this.onUpdateSetting("toStop", s)} />

                <label htmlFor="inputWalkTime">Walking Time (mins)</label>
                <input id="inputWalkTime"
                       type="number"
                       value={this.props.settings.walkTime}
                       onChange={event => this.onUpdateSetting("walkTime", event.target.value)} />
            </div>
        )
    }

    onUpdateSetting(key: string, value: any) {
        this.props.onUpdate(key, value);
    }
}
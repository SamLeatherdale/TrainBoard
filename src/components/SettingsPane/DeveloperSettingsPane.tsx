import {FormControlLabel} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Switch from "@material-ui/core/Switch";
import React from "react";
import SettingsPane from "./SettingsPane";

export default class DeveloperSettingsPane extends SettingsPane {
    render() {
        return (
            <div id={this.constructor.name}>
                <div className="settings-row">
                    <FormControlLabel
                        control={
                            <Switch
                                checked={this.props.settings.developer.mapDebug}
                                onChange={event => this.onUpdateSetting("developer.mapDebug", event.target.checked)}
                                value="developer.mapDebug"
                                color="primary"
                            />
                        }
                        label="Enable map debug"
                    />
                </div>

                <div className="settings-row">
                    <Button
                        variant={'contained'}
                        color={'secondary'}
                        onClick={this.props.onReset}
                    >Reset Default Settings</Button>
                </div>
            </div>
        )
    }
}
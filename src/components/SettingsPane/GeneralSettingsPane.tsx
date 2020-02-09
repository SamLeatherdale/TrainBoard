import React from "react";
import {InputLabel} from "@material-ui/core";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import Slider from "@material-ui/core/Slider";
import TextField from "@material-ui/core/TextField"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import SettingsPane from "./SettingsPane";
import StopSearch from "../StopSearch";

export default class GeneralSettingsPane extends SettingsPane {
    render() {
        return (
            <div id={this.constructor.name}>
                <div className="settings-row">
                    <InputLabel htmlFor={"stopSearchFrom"} shrink={true}>
                        From stop
                    </InputLabel>

                    <StopSearch
                        settings={this.props.settings}
                        inputId={"stopSearchFrom"}
                        label="From"
                        value={this.props.settings.fromStop}
                        onSelect={(s) => this.onUpdateSetting("fromStop", s)} />
                </div>

                <div className="settings-row">
                    <InputLabel htmlFor={"stopSearchTo"} shrink={true}>
                        To stop
                    </InputLabel>

                    <StopSearch
                        settings={this.props.settings}
                        inputId={"stopSearchTo"}
                        label="To"
                        value={this.props.settings.toStop}
                        onSelect={(s) => this.onUpdateSetting("toStop", s)} />
                </div>

                <div className="settings-row">
                    <InputLabel shrink={true}>
                        Walking time (mins)
                    </InputLabel>

                    <Slider
                        value={this.props.settings.walkTimeRange}
                        onChange={(event, newValue: number | number[]) => this.onUpdateSetting("walkTimeRange", newValue)}
                        valueLabelDisplay="auto"
                        aria-labelledby="walkTimeRange"
                        min={0}
                        max={30}
                    />
                </div>

                <div className="settings-row">
                    <InputLabel shrink={true}>
                        Number of trips to display
                    </InputLabel>

                    <Slider
                        value={this.props.settings.tripCount}
                        onChange={(event, newValue: number | number[]) => this.onUpdateSetting("tripCount", newValue)}
                        valueLabelDisplay="auto"
                        aria-labelledby="tripCount"
                        marks
                        min={5}
                        max={10}
                    />
                </div>

                <ExpansionPanel>
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        Advanced Settings
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <div className="settings-row">
                            <TextField
                                fullWidth
                                label="TfNSW API Key"
                                value={this.props.settings.apiKey}
                                onChange={event => this.onUpdateSetting("apiKey", event.target.value)}
                            />
                        </div>

                        <div className="settings-row">
                            <TextField
                                fullWidth
                                label="Proxy Server"
                                value={this.props.settings.proxyServer}
                                onChange={event => this.onUpdateSetting("proxyServer", event.target.value)}
                            />
                        </div>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            </div>
        )
    }
}
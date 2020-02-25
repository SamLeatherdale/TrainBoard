import _ from "lodash";
import React, {ChangeEvent} from "react";
import Select, {ActionMeta, InputActionMeta, OptionsType, ValueType} from "react-select";
import APIClient from "../classes/APIClient";
import SettingsSet from "../classes/SettingsSet";
import {StopFinderLocationMode} from "../models/TripPlanner/custom/stopFinderLocationMode";
import {StopFinderLocation} from "../models/TripPlanner/stopFinderLocation";
import AutoBoundComponent from "./AutoBoundComponent";

type Option = {
    label: string;
    value: string;
}

class StopSearchState {
    query: string = "";
    stops: StopFinderLocation[] = [];
    options: OptionsType<Option> = [];
}

interface StopSearchProps {
    settings: SettingsSet;
    label: string;
    inputId: string;
    onSelect: (stop?: StopFinderLocation) => any;
    value?: StopFinderLocation;
}

export default class StopSearch extends AutoBoundComponent<StopSearchProps, StopSearchState> {
    protected static _uid = 0;

    id = "";
    debounceGetStops;

    constructor(props) {
        super(props);

        this.id = `stop-search-${StopSearch._uid++}`;
        this.debounceGetStops = _.debounce(this.getStops, 500);
        this.state = new StopSearchState();
    }

    static convertLocToOption(loc: StopFinderLocation): Option {
        return {label: loc.name as string, value: loc.id as string};
    }

    onChange(e: ChangeEvent<HTMLInputElement>) {
        const query = e.target.value;

        this.setState({
            query: query
        }, this.debounceGetStops);
        
    }

    onSelectInputChange(query: string, actionMeta: InputActionMeta) {
        if (actionMeta.action === 'input-change') {
            this.debounceGetStops(query);
        }        
    }

    onSelect(selectedOption: ValueType<Option>, actionMeta: ActionMeta) {
        //if (actionMeta.action === "select-option" || actionMeta.action === "deselect-option")
        this.props.onSelect(selectedOption ? this.state.stops.find(stop => stop.id === (selectedOption as Option).value) : undefined);
    }

    getStops(query: string) {
        const client = new APIClient(this.props.settings.apiKey, this.props.settings.proxyServer);
        client.getTrainStops(query).then((locations) => {
            const options: OptionsType<Option> = locations.map(StopSearch.convertLocToOption);

            this.setState({
                stops: locations,
                options: options
            });
        }).catch((error) => {
            console.error(error.message);
        });
    }

    render() {
        return (
            <div className="stop-search">
                <Select
                    inputId={this.props.inputId}
                    value={this.props.value ? StopSearch.convertLocToOption(this.props.value) : undefined}
                    onChange={(selected, action) => this.onSelect(selected, action)}
                    onInputChange={this.onSelectInputChange}
                    options={this.state.options}
                />
            </div>
        );
    }
}
import autoBind from "auto-bind";
import _ from "lodash";
import APIClient from "../classes/APIClient";
import React, {ChangeEvent} from "react";
import Select, {ActionMeta, InputActionMeta, OptionsType, ValueType} from "react-select";
import {StopFinderLocation} from "../models/TripPlanner/stopFinderLocation";
import {StopFinderLocationMode} from "../models/TripPlanner/custom/stopFinderLocationMode";

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
    label: string;
    onSelect: (stop?: StopFinderLocation) => any;
    value?: StopFinderLocation;
}

export default class StopSearch extends React.Component<StopSearchProps, StopSearchState> {
    protected static _uid = 0;

    id = "";
    debounceGetStops;

    constructor(props) {
        super(props);
        autoBind.react(this);

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
        const client = APIClient.getClient();
        client.getStops(query).then((results) => {
            if (!results.locations) {
                throw new Error("Invalid response");
            }

            const locations = results.locations.filter(location => location.modes?.includes(StopFinderLocationMode.Train));
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
                    value={this.props.value ? StopSearch.convertLocToOption(this.props.value) : undefined}
                    onChange={(selected, action) => this.onSelect(selected, action)}
                    onInputChange={this.onSelectInputChange}
                    options={this.state.options}
                />
            </div>
        );
    }
}
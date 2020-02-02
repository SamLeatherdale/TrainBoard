import autoBind from "auto-bind";
import _ from "lodash";
import APIClient from "../classes/APIClient";
import React, {ChangeEvent} from "react";
import Select, {InputActionMeta, OptionsType} from "react-select";
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
    onSelect: (stop: StopFinderLocation) => any;
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

    getStops(query: string) {
        const client = APIClient.getClient();
        client.getStops(query).then((results) => {
            if (!results.locations) {
                throw new Error("Invalid response");
            }

            const locations = results.locations.filter(location => location.modes?.includes(StopFinderLocationMode.Train));
            const options: OptionsType<Option> = locations.map(loc => ({label: loc.name as string, value: loc.id as string}));
            this.setState({
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
                    onInputChange={this.onSelectInputChange}
                    options={this.state.options}
                />
            </div>
        );
    }
}
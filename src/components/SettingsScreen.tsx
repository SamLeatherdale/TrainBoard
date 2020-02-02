import React from "react";
import StopSearch from "./StopSearch";

export default class SettingsScreen extends React.Component {
    render() {
        return (
            <div>
                <StopSearch label="From" onSelect={() => 'a'} />
                <StopSearch label="To" onSelect={() => 'a'} />
            </div>
        )
    }
}
import React from 'react';
import SettingsScreen from './components/SettingsScreen';
import SettingsSet from "./classes/SettingsSet";
import autoBind from "auto-bind";
import APIClient from "./classes/APIClient";
import {TripRequestResponseJourney} from "./models/TripPlanner/tripRequestResponseJourney";
import TripBoard from "./components/TripBoard";

interface AppState {
    settings: SettingsSet
    trips: TripRequestResponseJourney[]
}

export default class App extends React.Component<{}, AppState> {
    static readonly STORAGE_KEY = "appSettings";

    constructor(props) {
        super(props);
        autoBind.react(this);

        this.state = {
            settings: this.readSettings(),
            trips: []
        }
    }

    componentDidMount(): void {
        this.getTrips();
    }

    readSettings(): SettingsSet {
        const settings = new SettingsSet();
        let rawSettings = JSON.parse(window.localStorage.getItem(App.STORAGE_KEY) ?? "");

        for (let key of Object.keys(settings)) {
            if (rawSettings[key]) {
                settings[key] = rawSettings[key];
            }
        }
        return settings;
    }

    writeSettings(): void {
        window.localStorage.setItem(App.STORAGE_KEY, JSON.stringify(this.state.settings));
    }

    onUpdateSetting(key: string, value: any) {
        this.setState(prevState => {
            return {
                settings: {
                    ...prevState.settings,
                    [key]: value
                }
            }
        }, () => {
            this.writeSettings();
            if (["fromStop", "toStop"].includes(key)) {
                this.getTrips();
            }
        });
    }

    getTrips() {
        if (!(this.state.settings.fromStop && this.state.settings.toStop)) {
            return;
        }

       APIClient.getClient().getTrips(this.state.settings.fromStop, this.state.settings.toStop).then(response => {
           if (!response.journeys) {
               throw new Error("Missing trips from response.");
           }

           this.setState({
                trips: response.journeys
           })
       }).catch(e => {
           console.error(e);
       });
    }

    render() {
        return (
            <div className="App">
                <div className="container">
                    <SettingsScreen settings={this.state.settings} onUpdate={(key, value) => this.onUpdateSetting(key, value)} />
                    <TripBoard trips={this.state.trips} settings={this.state.settings} />
                </div>
            </div>
        );
    }
}
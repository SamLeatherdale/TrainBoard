import React from 'react';
import SettingsScreen from './components/SettingsScreen';
import SettingsSet from "./classes/SettingsSet";
import autoBind from "auto-bind";
import APIClient from "./classes/APIClient";
import {TripRequestResponseJourney} from "./models/TripPlanner/tripRequestResponseJourney";
import TripBoard from "./components/TripBoard";
import AppBar from "@material-ui/core/AppBar";
import IconButton from "@material-ui/core/IconButton";
import Toolbar from "@material-ui/core/Toolbar";
import MenuIcon from "@material-ui/icons/Menu";
import {makeStyles} from "@material-ui/core/styles";

interface AppState {
    settings: SettingsSet
    settingsMenuOpen: boolean,
    trips: TripRequestResponseJourney[]
}

const appBarStyles = {
    root: {
        backgroundColor: "#f18500"
    }
};

export default class App extends React.Component<{}, AppState> {
    static readonly STORAGE_KEY = "appSettings";

    constructor(props) {
        super(props);
        autoBind.react(this);

        this.state = {
            settings: this.readSettings(),
            settingsMenuOpen: false,
            trips: []
        }
    }

    componentDidMount(): void {
        this.getTrips();
    }

    readSettings(): SettingsSet {
        const settings = new SettingsSet();
        let rawSettings;
        try {
            rawSettings = JSON.parse(window.localStorage.getItem(App.STORAGE_KEY) || "");
        } catch (e) {
            rawSettings = {};
        }

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

    toggleMenu() {
        this.setState(prevState => ({ settingsMenuOpen: !prevState.settingsMenuOpen }));
    }

    getTrips() {
        if (!(this.state.settings.fromStop && this.state.settings.toStop)) {
            return;
        }

        const client = new APIClient(this.state.settings.apiKey, this.state.settings.proxyServer);
        client.getTrips(this.state.settings.fromStop, this.state.settings.toStop).then(response => {
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
                <div className="container-fluid">
                    <AppBar position="static">
                        <Toolbar>
                            <IconButton edge="start" color="inherit" aria-label="menu" onClick={this.toggleMenu}>
                                <MenuIcon />
                            </IconButton>
                        </Toolbar>
                    </AppBar>
                    <SettingsScreen
                        menuOpen={this.state.settingsMenuOpen}
                        settings={this.state.settings}
                        onUpdate={(key, value) => this.onUpdateSetting(key, value)}
                        onClose={() => this.setState({settingsMenuOpen: false})}
                    />
                    <TripBoard trips={this.state.trips} settings={this.state.settings} />
                </div>
            </div>
        );
    }
}
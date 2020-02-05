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
import RefreshTimer from "./components/RefreshTimer";
import moment from "moment";
import {StopFinderLocation} from "./models/TripPlanner/stopFinderLocation";
import Clock from "react-live-clock";
import {Typography} from "@material-ui/core";

interface AppState {
    settings: SettingsSet
    settingsMenuOpen: boolean,
    trips: TripRequestResponseJourney[]
    isTripsRefreshing: boolean
    lastRefreshTime: number;
}

export default class App extends React.Component<{}, AppState> {
    static readonly STORAGE_KEY = "appSettings";
    protected getTripsInterval = 30;
    protected getTripsTimeoutKey;
    protected renderTripsInterval = 5;

    constructor(props) {
        super(props);
        autoBind.react(this);

        this.state = {
            settings: this.readSettings(),
            settingsMenuOpen: false,
            trips: [],
            isTripsRefreshing: false,
            lastRefreshTime: 0
        }
    }

    componentDidMount(): void {
        this.getTrips();
    }

    componentWillUnmount(): void {
        clearTimeout(this.getTripsTimeoutKey);
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

    isConfiguredTrip() {
        return this.state.settings.fromStop && this.state.settings.toStop;
    }

    getConfiguredTrip(): undefined |
        {from: StopFinderLocation, to: StopFinderLocation} {
        if (!this.isConfiguredTrip()) {
            return undefined;
        }

        return {
            from: this.state.settings.fromStop as StopFinderLocation,
            to: this.state.settings.toStop as StopFinderLocation
        };
    }

    getCurrentTripLabel() {
        const trip = this.getConfiguredTrip();
        if (!trip) {
            return '';
        }

        return `: ${trip.from.parent.disassembledName} ➡ ${trip.to.parent.disassembledName}`
    }

    getTrips() {
        const trip = this.getConfiguredTrip();
        if (!trip) {
            return;
        }
        const {from, to} = trip;

        clearTimeout(this.getTripsTimeoutKey);

        this.setState({isTripsRefreshing: true});
        const client = new APIClient(this.state.settings.apiKey, this.state.settings.proxyServer);
        client.getTrips(from, to).then(response => {
           if (!response.journeys) {
               throw new Error("Missing trips from response.");
           }

           this.scheduleTimeout();
           this.setState(prevState => {
               return {
                   trips: response.journeys,
                   isTripsRefreshing: false,
                   lastRefreshTime: Date.now()
               }
           });
       }).catch(e => {
           this.setState({isTripsRefreshing: false});
           console.error(e);
       });
    }

    scheduleTimeout() {
        setTimeout(this.getTrips, this.getTripsInterval * 1000);
    }

    render() {

        return (
            <div className="App">
                <AppBar position="static" id="main-appbar">
                    <Toolbar>
                        <IconButton edge="start" color="inherit" aria-label="menu" onClick={this.toggleMenu}>
                            <MenuIcon />
                        </IconButton>
                        <Typography variant={"h6"}>
                            Train Board {this.getCurrentTripLabel()}
                        </Typography>
                    </Toolbar>
                </AppBar>
                <SettingsScreen
                    menuOpen={this.state.settingsMenuOpen}
                    settings={this.state.settings}
                    onUpdate={(key, value) => this.onUpdateSetting(key, value)}
                    onClose={() => this.setState({settingsMenuOpen: false})}
                />

                <main>
                    <div id="main-wrap">
                        <div id="main-toolbar">
                        </div>
                        <div id="trip-board-container">
                            {this.isConfiguredTrip() &&
                            <div id="trip-board-toolbar">
                                <Clock format={'HH:mm:ssa'} ticking={true} />
                                <div id="trip-board-timer-container">
                                    {!!this.state.lastRefreshTime &&
                                        <div className="status-last-refresh">Last refreshed: {moment(this.state.lastRefreshTime).format("hh:mm:ssa")}</div>
                                    }
                                    <RefreshTimer
                                        isRefreshing={this.state.isTripsRefreshing}
                                        durationSeconds={this.getTripsInterval}
                                        resetKey={this.state.lastRefreshTime}
                                        />
                                </div>
                            </div>}
                            <TripBoard
                                trips={this.state.trips}
                                settings={this.state.settings}
                                renderInterval={this.renderTripsInterval}
                            />
                        </div>
                    </div>
                </main>
            </div>
        );
    }
}
import {Typography} from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import IconButton from "@material-ui/core/IconButton";
import Toolbar from "@material-ui/core/Toolbar";
import ExitIcon from "@material-ui/icons/ExitToApp";
import MenuIcon from "@material-ui/icons/Menu";
import _ from "lodash";
import moment from "moment";
import React from 'react';
import Clock from "react-live-clock";
import APIClient from "./classes/APIClient";
import SettingsSet from "./classes/SettingsSet";
import AutoBoundComponent from "./components/AutoBoundComponent";
import RefreshTimer from "./components/RefreshTimer";
import SettingsScreen from './components/SettingsScreen';
import RemindersWidget from "./components/Widget/RemindersWidget";
import TrainMap from "./components/Widget/TrainMap";
import TripBoard from "./components/TripBoard";
import {TripRequestResponseJourney} from "./models/TripPlanner/tripRequestResponseJourney";

interface AppState {
    settings: SettingsSet
    settingsMenuOpen: boolean,
    trips: TripRequestResponseJourney[]
    isTripsRefreshing: boolean
    lastRefreshTime: number;
}

export default class App extends AutoBoundComponent<{}, AppState> {
    static readonly STORAGE_KEY = "appSettings";
    protected getTripsInterval = 30;
    protected getTripsTimeoutKey;
    protected renderTripsInterval = 5;

    constructor(props) {
        super(props);
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
        let rawSettings;
        try {
            rawSettings = JSON.parse(window.localStorage.getItem(App.STORAGE_KEY) || "");
        } catch (e) {
            rawSettings = {};
        }

        return new SettingsSet(rawSettings);
    }

    writeSettings(): void {
        window.localStorage.setItem(App.STORAGE_KEY, JSON.stringify(this.state.settings));
    }

    onUpdateSetting(key: string, value: any) {
        this.setState(prevState => {
            const settings = _.cloneDeep(prevState.settings);
            _.set(settings, key, value);
            return {settings};
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

    getCurrentTripLabel() {
        const trip = this.state.settings.getConfiguredTrip();
        if (!trip) {
            return '';
        }

        return `: ${trip.from.disassembledName} ➡ ${trip.to.disassembledName}`
    }

    getTrips() {
        const trip = this.state.settings.getConfiguredTrip();
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
                            Train Board{this.getCurrentTripLabel()}
                        </Typography>
                        <IconButton color="inherit" onClick={window.close}>
                            <ExitIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <SettingsScreen
                    menuOpen={this.state.settingsMenuOpen}
                    settings={this.state.settings}
                    onUpdate={(key, value) => this.onUpdateSetting(key, value)}
                    onClose={() => this.setState({settingsMenuOpen: false})}
                />

                <main className={[this.state.settings.maps.enabled ? "maps-enabled" : ""].join(" ")}>
                    <TrainMap settings={this.state.settings} trips={this.state.trips} />
                    <RemindersWidget settings={this.state.settings} />
                    <div id="main-wrap">
                        <div id="main-toolbar">
                        </div>
                        <div id="trip-board-container">
                            {this.state.settings.isConfiguredTrip() &&
                            <div id="trip-board-toolbar">
                                <Clock format={'hh:mm:ssa'} ticking={true} />
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
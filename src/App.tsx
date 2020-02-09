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
import {ParsedVehiclePositionEntity} from "./models/GTFS/VehiclePositions";
import {TripRequestResponseJourney} from "./models/TripPlanner/tripRequestResponseJourney";

interface AppState {
    settings: SettingsSet
    settingsMenuOpen: boolean,
    trips: TripRequestResponseJourney[]
    realtimeTripData: ParsedVehiclePositionEntity[],
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
            realtimeTripData: [],
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
        this.setState(prevState => ({settingsMenuOpen: !prevState.settingsMenuOpen}));
    }

    getCurrentTripLabel() {
        const trip = this.state.settings.getConfiguredTrip();
        if (!trip) {
            return '';
        }

        return `: ${trip.from.disassembledName} ➡ ${trip.to.disassembledName}`
    }

    async getTrips() {
        const {settings} = this.state;
        const trip = settings.getConfiguredTrip();
        if (!trip) {
            return;
        }
        const {from, to} = trip;

        clearTimeout(this.getTripsTimeoutKey);

        this.setState({isTripsRefreshing: true});
        const client = new APIClient(settings.apiKey, settings.proxyServer);
        try {
            const response = await client.getTrips(from, to, settings.tripCount);
            if (!response.journeys) {
                throw new Error("Missing trips from response.");
            }

            const getRealtime = settings.maps.enabled;

            this.setState({
                trips: response.journeys,
                isTripsRefreshing: getRealtime,
                lastRefreshTime: Date.now()
            });

            // Now get realtime data
            if (getRealtime) {
                const tripIds: string[] = response.journeys
                    .map(j => j.legs[0].transportation?.properties?.RealtimeTripId)
                    .filter(id => !!id) as string[];
                const positionEntities = await client.getGTFSRealtime(tripIds);
                this.setState({
                    realtimeTripData: positionEntities,
                    isTripsRefreshing: false
                });
            }
        } catch (e) {
            this.setState({isTripsRefreshing: false});
            console.error(e);
        } finally {
            // No matter what, try again later
            this.scheduleTimeout();
        }
    }

    scheduleTimeout() {
        setTimeout(this.getTrips, this.getTripsInterval * 1000);
    }

    render() {
        const {settings, trips, isTripsRefreshing, lastRefreshTime, realtimeTripData, settingsMenuOpen} = this.state;

        return (
            <div className="App">
                <AppBar position="static" id="main-appbar">
                    <Toolbar>
                        <IconButton edge="start" color="inherit" aria-label="menu" onClick={this.toggleMenu}>
                            <MenuIcon/>
                        </IconButton>
                        <Typography variant={"h6"}>
                            Train Board{this.getCurrentTripLabel()}
                        </Typography>
                        <IconButton color="inherit" onClick={window.close}>
                            <ExitIcon/>
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <SettingsScreen
                    menuOpen={settingsMenuOpen}
                    settings={settings}
                    onUpdate={(key, value) => this.onUpdateSetting(key, value)}
                    onClose={() => this.setState({settingsMenuOpen: false})}
                />

                <main className={[settings.maps.enabled ? "maps-enabled" : ""].join(" ")}>
                    <TrainMap
                        settings={settings}
                        trips={trips}
                        realtimeTripData={realtimeTripData.slice(0, 2)}
                    />
                    <RemindersWidget settings={settings} />
                    <div id="main-wrap">
                        <div id="trip-board-container" hidden={settings.developer.mapDebug}>
                            {settings.isConfiguredTrip() &&
                            <div id="trip-board-toolbar">
                                <Clock format={'hh:mm:ssa'} ticking={true}/>
                                <div id="trip-board-timer-container">
                                    {!!lastRefreshTime &&
                                    <div className="status-last-refresh">Last
                                        refreshed: {moment(lastRefreshTime).format("hh:mm:ssa")}</div>
                                    }
                                    <RefreshTimer
                                        isRefreshing={isTripsRefreshing}
                                        durationSeconds={this.getTripsInterval}
                                        resetKey={lastRefreshTime}
                                    />
                                </div>
                            </div>}
                            <TripBoard
                                trips={trips}
                                realtimeTripData={realtimeTripData}
                                settings={settings}
                                renderInterval={this.renderTripsInterval}
                            />
                        </div>
                    </div>
                </main>
            </div>
        );
    }
}
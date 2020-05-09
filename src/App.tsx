import {Typography} from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import Toolbar from "@material-ui/core/Toolbar";
import ExitIcon from "@material-ui/icons/ExitToApp";
import MenuIcon from "@material-ui/icons/Menu";
import Alert from "@material-ui/lab/Alert"
import _ from "lodash";
import createMoment, { TIMEZONE } from "./classes/Moment";
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
import WelcomeMessage from "./components/WelcomeMessage";

interface AppState {
    settings: SettingsSet
    settingsMenuOpen: boolean,
    trips: TripRequestResponseJourney[]
    realtimeTripData: ParsedVehiclePositionEntity[],
    isTripsRefreshing: boolean
    lastRefreshTime: number;
    lastApiError: string;
}

export default class App extends AutoBoundComponent<{}, AppState> {
    protected getTripsInterval = 30;
    protected getTripsTimeoutKey;
    protected renderTripsInterval = 5;

    constructor(props) {
        super(props);
        this.state = {
            settings: SettingsSet.readSettings(),
            settingsMenuOpen: false,
            trips: [],
            realtimeTripData: [],
            isTripsRefreshing: false,
            lastRefreshTime: 0,
            lastApiError: ''
        }
    }

    componentDidMount(): void {
        this.maybeLoadRemoteSettings();
        this.getTrips();
    }

    componentWillUnmount(): void {
        clearTimeout(this.getTripsTimeoutKey);
    }

    async maybeLoadRemoteSettings(): Promise<void> {
        const { settings } = this.state;
        const url = new URL(window.location.href);
        const loadUrl = url.searchParams.get('loadSettings');

        if (loadUrl) {
            try {
                const newSettings = await SettingsSet.loadRemoteSettings(loadUrl, settings);
                this.setState({
                    settings: newSettings
                })
            } catch (e) {
                console.error(e);
            }
        }
    }

    readSettings(): void {
        this.setState({
            settings: SettingsSet.readSettings()
        })
    }

    writeSettings(): void {
        SettingsSet.writeSettings(this.state.settings);
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

    onResetSettings() {
        SettingsSet.resetSettings();
        this.readSettings();
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
            const response = await client.getTrips(from, to, settings.tripCount + 1);
            const getRealtime = settings.maps.enabled;

            this.setState({
                trips: response.journeys,
                isTripsRefreshing: getRealtime,
                lastRefreshTime: Date.now(),
                lastApiError: ''
            });

            // Now get realtime data
            if (getRealtime) {
                const tripIds: string[] = response.journeys
                    .map(j => j.legs[0].transportation?.properties?.RealtimeTripId)
                    .filter(id => !!id) as string[];
                const positionEntities = await client.getGTFSRealtime(tripIds);
                this.setState({
                    realtimeTripData: positionEntities,
                    isTripsRefreshing: false,
                    lastApiError: ''
                });
            }
        } catch (e) {
            let message = e.message;

            if (/Failed to fetch/i.test(e.message)) {
                message = 'Failed to fetch data from the proxy server. Please check your proxy settings (and check the proxy server is running) and try again.'
            } else if (/401 Unauthorized/i.test(e.message)) {
                message = 'Failed to fetch data due to an invalid API key. Please check your TfNSW API key and try again.';
            }

            this.setState({
                isTripsRefreshing: false,
                lastApiError: message
            });
            console.error(e);
        } finally {
            // No matter what, try again later
            this.scheduleTimeout();
        }
    }

    scheduleTimeout() {
        window.clearTimeout(this.getTripsTimeoutKey);
        this.getTripsTimeoutKey = window.setTimeout(this.getTrips, this.getTripsInterval * 1000);
    }

    render() {
        const {
            settings,
            trips,
            isTripsRefreshing,
            lastRefreshTime,
            lastApiError,
            realtimeTripData,
            settingsMenuOpen,
        } = this.state;

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
                    onReset={this.onResetSettings}
                    onClose={() => this.setState({settingsMenuOpen: false})}
                />

                <main className={[settings.maps.enabled ? "maps-enabled" : ""].join(" ")}>  
                
                {!settings.isConfiguredTrip() && <WelcomeMessage />}  
                    <Snackbar
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                        open={!!lastApiError}
                        autoHideDuration={5000}>
                        <Alert severity={'error'} elevation={6} variant={'filled'}>{lastApiError}</Alert>
                    </Snackbar>
                    <TrainMap
                        settings={settings}
                        trips={trips}
                        realtimeTripData={realtimeTripData.slice(0, 2)}
                    />
                    <div className='main-grid'>
                    <RemindersWidget settings={settings} />
                    <div className="main-wrap">
                        <div id="trip-board-container" hidden={settings.developer.mapDebug}>
                            {settings.isConfiguredTrip() &&
                            <div id="trip-board-toolbar">
                                <Clock
                                    format={'hh:mm:ssa'}
                                    ticking={true}
                                    timezone={TIMEZONE}
                                />
                                <div id="trip-board-timer-container">
                                    {!!lastRefreshTime &&
                                    <div className="status-last-refresh">Last
                                        refreshed: {createMoment(lastRefreshTime).format("hh:mm:ssa")}</div>
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
                    </div>
                </main>
            </div>
        );
    }
}
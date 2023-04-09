import React, { useEffect, useState } from "react";

import MenuIcon from "@mui/icons-material/Menu";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { styled } from "@mui/material/styles";
import cloneDeep from "lodash/cloneDeep";
import get from "lodash/get";
import set from "lodash/set";
import { Route, Routes, useNavigate } from "react-router-dom";

import APIClient from "./classes/APIClient";
import SettingsSet from "./classes/SettingsSet";
import CardMessage from "./components/CardMessage";
import Clock from "./components/Clock";
import MainAppBar from "./components/MainAppBar";
import RefreshTimer from "./components/RefreshTimer";
import { OnUpdateFunc, SettingsPane } from "./components/SettingsPane/SettingsPane";
import SettingsScreen from "./components/SettingsScreen";
import TripBoard from "./components/TripBoard";
import RemindersWidget from "./components/Widget/RemindersWidget";
import TrainMap from "./components/Widget/TrainMap";
import { ParsedVehiclePositionEntity } from "./models/GTFS/VehiclePositions";
import { TripRequestResponseJourney } from "./models/TripPlanner/tripRequestResponseJourney";
import { formatMediumTime } from "./util/date";

export default function App() {
    const tripsInterval = 30;
    const renderTripsInterval = 5;
    const navigate = useNavigate();
    const [tripsTimeoutKey, setTripsTimeoutKey] = useState(-1);
    const [settings, setSettings] = useState(() => SettingsSet.readSettings());
    const [hasInitialized, setHasInitialized] = useState(false);
    const [trips, setTrips] = useState<TripRequestResponseJourney[]>([]);
    const [realtimeTripData, setRealtimeTripData] = useState<ParsedVehiclePositionEntity[]>([]);
    const [isTripsRefreshing, setIsTripsRefreshing] = useState(false);
    const [lastRefreshTime, setLastRefreshTime] = useState(0);
    const [lastApiError, setLastApiError] = useState("");

    useEffect(() => {
        (async () => {
            await maybeLoadRemoteSettings();
            await getTrips();
        })();
        return () => {
            clearTimeout(tripsTimeoutKey);
        };
    }, []);

    const maybeLoadRemoteSettings = async () => {
        const url = new URL(window.location.href);
        const loadUrl = url.searchParams.get("loadSettings");
        if (loadUrl) {
            try {
                const newSettings = await SettingsSet.loadRemoteSettings(loadUrl, settings);
                setSettings(newSettings);
            } catch (e) {
                console.error(e);
            }
        }
    };

    const readSettings = () => {
        setSettings(SettingsSet.readSettings());
    };

    const onUpdateSetting: OnUpdateFunc = (key, value, delta) => {
        setSettings((prevState) => {
            const settings = cloneDeep(prevState);
            const currentValue = get(settings, key);
            if (delta && typeof currentValue === "number") {
                set(settings, key, currentValue + value);
            } else {
                set(settings, key, value);
            }

            console.log(settings);

            SettingsSet.writeSettings(settings);
            if (["fromStop", "toStop"].includes(key)) {
                getTrips(settings);
            }

            return settings;
        });
    };

    const onResetSettings = () => {
        SettingsSet.resetSettings();
        readSettings();
    };

    const openMenu = () => {
        navigate({ pathname: `/settings/${SettingsPane.GENERAL}` });
    };

    const getCurrentTripLabel = () => {
        const trip = settings.getConfiguredTrip();
        if (!trip) {
            return "";
        }
        return `: ${trip.from.disassembledName} ➡ ${trip.to.disassembledName}`;
    };

    const getTrips = async (useSettings: SettingsSet = settings) => {
        const trip = useSettings.getConfiguredTrip();
        if (!trip) {
            return;
        }
        const { from, to } = trip;

        clearTimeout(tripsTimeoutKey);

        setIsTripsRefreshing(true);
        const client = new APIClient();
        try {
            const response = await client.getTrips(from, to, useSettings.tripCount + 1);
            const getRealtime = useSettings.maps.enabled;

            setHasInitialized(true);
            setTrips(response.journeys || []);
            setIsTripsRefreshing(getRealtime);
            setLastRefreshTime(Date.now());
            setLastApiError("");

            // Now get realtime data
            if (getRealtime) {
                const tripIds = response.journeys
                    .map((j) => j.legs[0].transportation?.properties?.RealtimeTripId)
                    .filter((id) => !!id) as string[];
                const positionEntities = await client.getGTFSRealtime(tripIds);
                setRealtimeTripData(positionEntities);
                setIsTripsRefreshing(false);
                setLastApiError("");
            }
        } catch (e) {
            let message = e instanceof Error ? e.message : JSON.stringify(e);

            if (/Failed to fetch/i.test(message)) {
                message =
                    "Failed to fetch data from the proxy server. Please check your proxy settings (and check the proxy server is running) and try again.";
            } else if (/401 Unauthorized/i.test(message)) {
                message =
                    "Failed to fetch data due to an invalid API key. Please check your TfNSW API key and try again.";
            }

            setIsTripsRefreshing(false);
            setLastApiError(message);
            console.error(e);
        } finally {
            // No matter what, try again later
            scheduleTimeout();
        }
    };

    const scheduleTimeout = () => {
        window.clearTimeout(tripsTimeoutKey);
        setTripsTimeoutKey(window.setTimeout(getTrips, tripsInterval * 1000));
    };

    return (
        <div className="App">
            <MainAppBar openMenu={openMenu} label={getCurrentTripLabel()} />
            <Routes>
                <Route
                    path="settings/*"
                    element={
                        <SettingsScreen
                            menuOpen={true}
                            settings={settings}
                            onUpdate={onUpdateSetting}
                            onReset={onResetSettings}
                            onClose={() => {
                                navigate({ pathname: "/" });
                            }}
                        />
                    }
                />
            </Routes>

            <main className={[settings.maps.enabled ? "maps-enabled" : ""].join(" ")}>
                {!settings.isConfiguredTrip() && (
                    <CardMessage
                        title="Welcome"
                        body={
                            <>
                                Welcome to TrainBoard! To get started, open the settings menu (
                                <MenuIconStyled />) and configure your From and To stops.
                            </>
                        }
                    />
                )}
                {settings.isConfiguredTrip() && hasInitialized && trips.length === 0 && (
                    <CardMessage
                        title="No trips"
                        body="No trips were found matching your from and to stops. Please try setting different stops."
                    />
                )}
                <Snackbar
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                    open={!!lastApiError}
                    autoHideDuration={5000}
                >
                    <Alert severity={"error"} elevation={6} variant={"filled"}>
                        {lastApiError}
                    </Alert>
                </Snackbar>
                <TrainMap
                    settings={settings}
                    trips={trips}
                    realtimeTripData={realtimeTripData.slice(0, 2)}
                />
                <div className="main-grid">
                    <RemindersWidget settings={settings} />
                    <div className="main-wrap">
                        <div id="trip-board-container">
                            {settings.isConfiguredTrip() && (
                                <div id="trip-board-toolbar">
                                    <Clock />
                                    <div id="trip-board-timer-container">
                                        {!!lastRefreshTime && (
                                            <div className="status-last-refresh">
                                                Last refreshed:{" "}
                                                {formatMediumTime(new Date(lastRefreshTime))}
                                            </div>
                                        )}
                                        <RefreshTimer
                                            isRefreshing={isTripsRefreshing}
                                            durationSeconds={tripsInterval}
                                            key={lastRefreshTime}
                                        />
                                    </div>
                                </div>
                            )}
                            <TripBoard
                                trips={trips}
                                realtimeTripData={realtimeTripData}
                                settings={settings}
                                renderInterval={renderTripsInterval}
                            />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

const MenuIconStyled = styled(MenuIcon)({
    verticalAlign: "middle",
    lineHeight: "initial",
});

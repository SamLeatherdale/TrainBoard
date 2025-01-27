import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";

import MenuIcon from "@mui/icons-material/Menu";
import { Box } from "@mui/material";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { styled, ThemeProvider } from "@mui/material/styles";
import { Route, Routes, useNavigate } from "react-router-dom";

import APIClient from "./classes/APIClient";
import SettingsManager, { SettingsSet } from "./classes/SettingsSet";
import CardMessage from "./components/CardMessage";
import MainAppBar from "./components/MainAppBar";
import RefreshTimer from "./components/RefreshTimer";
import { OnUpdateFunc, SettingsPane } from "./components/SettingsPane/SettingsPane";
import SettingsScreen from "./components/SettingsScreen";
import TripBoard from "./components/TripBoard";
import { ParsedVehiclePositionEntity } from "./models/GTFS/VehiclePositions";
import { TPJourney } from "./models/TripPlanner/custom/TPJourney";
import { createAppTheme } from "./theme";
import { getAndroid } from "./util/android";
import { initDpad } from "./util/dpad";

const TrainMap = React.lazy(() => import("./components/Widget/TrainMap"));

export default function App() {
    const tripsInterval = 30;
    const navigate = useNavigate();
    const [settings, setSettings] = useState(() => SettingsManager.readSettings());
    const [hasInitialized, setHasInitialized] = useState(false);
    const [trips, setTrips] = useState<TPJourney[]>([]);
    const [realtimeTripData, setRealtimeTripData] = useState<ParsedVehiclePositionEntity[]>([]);
    const [isTripsRefreshing, setIsTripsRefreshing] = useState(false);
    const [lastRefreshTime, setLastRefreshTime] = useState<number | null>(null);
    const [lastApiError, setLastApiError] = useState("");
    const [burnInProtection, setBurnInProtection] = useState({ top: 0, left: 0 });
    const tripsTimeoutKey = useRef(0);

    const theme = useMemo(() => createAppTheme(settings.theme), [settings.theme]);

    useEffect(() => {
        getAndroid()?.ready();
        initDpad();
        (async () => {
            await maybeLoadRemoteSettings();
            await getTrips();
        })();
        return () => {
            window.clearTimeout(tripsTimeoutKey.current);
        };
    }, []);

    const maybeLoadRemoteSettings = async () => {
        const url = new URL(window.location.href);
        const loadUrl = url.searchParams.get("loadSettings");
        if (loadUrl) {
            try {
                const newSettings = await SettingsManager.loadRemoteSettings(loadUrl, settings);
                setSettings(newSettings);
            } catch (e) {
                console.error(e);
            }
        }
    };

    const readSettings = () => {
        setSettings(SettingsManager.readSettings());
    };

    const onUpdateSetting: OnUpdateFunc = (key, value) => {
        setSettings((prevState) => {
            const prevValue = prevState[key];
            const settings = {
                ...prevState,
                [key]: typeof value === "function" ? value(prevValue) : value,
            };
            if (["fromStop", "toStop"].includes(key)) {
                settings.recentStops = [
                    value,
                    ...(prevState.recentStops || []).filter((stop) => stop.id !== value.id),
                ];
            }

            SettingsManager.writeSettings(settings);
            if ((["fromStop", "toStop", "excludedModes"] as (keyof SettingsSet)[]).includes(key)) {
                getTrips();
            }

            return settings;
        });
    };

    const onResetSettings = () => {
        SettingsManager.resetSettings();
        readSettings();
    };

    const openMenu = () => {
        navigate({ pathname: `/settings/${SettingsPane.GENERAL}` });
    };

    const getCurrentTripLabel = () => {
        const trip = SettingsManager.getConfiguredTrip(settings);
        if (!trip) {
            return "";
        }
        return `: ${trip.from.disassembledName} ➡ ${trip.to.disassembledName}`;
    };

    const getTrips = async () => {
        const useSettings = SettingsManager.readSettings();
        const trip = SettingsManager.getConfiguredTrip(useSettings);
        if (!trip) {
            return;
        }
        const { from, to } = trip;

        window.clearTimeout(tripsTimeoutKey.current);

        setIsTripsRefreshing(true);
        const client = new APIClient();
        try {
            const response = await client.getTrips(from.id, to.id, useSettings);

            setHasInitialized(true);
            setTrips(response.journeys || []);
            setLastRefreshTime(Date.now());
            setLastApiError("");

            const updatedJourneys = await client.getGTFSRealtime(response.journeys);
            setTrips(updatedJourneys);
            setIsTripsRefreshing(false);
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
            setBurnInProtection(
                useSettings.burnInProtection
                    ? {
                          top: Math.random() * 10,
                          left: Math.random() * 10,
                      }
                    : { top: 0, left: 0 }
            );
        }
    };

    const scheduleTimeout = () => {
        window.clearTimeout(tripsTimeoutKey.current);
        tripsTimeoutKey.current = window.setTimeout(getTrips, tripsInterval * 1000);
    };

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ position: "relative", ...burnInProtection }}>
                <MainAppBar
                    openMenu={openMenu}
                    label={getCurrentTripLabel()}
                    refreshTimer={
                        lastRefreshTime && (
                            <RefreshTimer
                                isRefreshing={isTripsRefreshing}
                                durationSeconds={tripsInterval}
                                key={lastRefreshTime}
                            />
                        )
                    }
                    theme={settings.theme}
                    toggleTheme={() =>
                        onUpdateSetting("theme", (theme) => (theme === "dark" ? "light" : "dark"))
                    }
                />
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

                <Main transparent={settings.mapsEnabled}>
                    {!SettingsManager.isConfiguredTrip(settings) && (
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
                    {SettingsManager.isConfiguredTrip(settings) &&
                        hasInitialized &&
                        trips.length === 0 && (
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
                    {settings.mapsEnabled && (
                        <Suspense fallback={<></>}>
                            <TrainMap
                                settings={settings}
                                trips={trips}
                                realtimeTripData={realtimeTripData}
                            />
                        </Suspense>
                    )}
                    {!settings.mapsEnabled && (
                        <TripBoardContainer className="main-wrap">
                            <TripBoard trips={trips} settings={settings} />
                        </TripBoardContainer>
                    )}
                </Main>
            </Box>
        </ThemeProvider>
    );
}

const Main = styled("main")<{ transparent: boolean }>((props) => ({
    position: "relative",
    flexGrow: 1,
    backgroundColor: props.transparent ? "transparent" : "#222",
    alignItems: "center",
    justifyContent: "center",
}));
const MenuIconStyled = styled(MenuIcon)({
    verticalAlign: "middle",
    lineHeight: "initial",
});
const TripBoardContainer = styled("div")({
    width: "90%",
    margin: "auto",
});

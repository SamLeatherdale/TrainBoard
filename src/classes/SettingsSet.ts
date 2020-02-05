import {StopFinderLocation} from "../models/TripPlanner/stopFinderLocation";

export default class SettingsSet {
    public fromStop?: StopFinderLocation;
    public toStop?: StopFinderLocation;
    public walkTimeRange: [number, number] = [8,10];
    public apiKey = "";
    public proxyServer = "http://localhost:8010";
}
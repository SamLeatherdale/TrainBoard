import {StopFinderLocation} from "../models/TripPlanner/stopFinderLocation";

export default class SettingsSet {
    public fromStop?: StopFinderLocation;
    public toStop?: StopFinderLocation;
    public walkTime = 10;
    public walkTimeBuffer = 1;
    public apiKey = "";
    public proxyServer = "http://localhost:8010";
}
import {StopFinderLocation} from "../models/TripPlanner/stopFinderLocation";

export default class SettingsSet {
    public fromStop?: StopFinderLocation;
    public toStop?: StopFinderLocation;
    public walkTime = 10;
}
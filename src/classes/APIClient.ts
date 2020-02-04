import {TPStopType, TPCoordOutputFormat} from "./types";
import {StopFinderResponse} from "../models/TripPlanner/stopFinderResponse";
import {StopFinderLocation} from "../models/TripPlanner/stopFinderLocation";
import {TripRequestResponse} from "../models/TripPlanner/tripRequestResponse";

export default class APIClient {
    static readonly API_VERSION = "10.2.1.42";
    static readonly API_URL = "https://api.transport.nsw.gov.au/v1";
    apiKey = "";
    readonly proxyUrl;

    constructor(apiKey: string, proxyUrl: string) {
        this.apiKey = apiKey;
        this.proxyUrl = `${proxyUrl}/${APIClient.API_URL}`;
        //this.proxyUrl = `https://crossorigin.me/${APIClient.API_URL}`;
    }

    async performRequest(url: string, params: { [prop: string]: any }) {
        const defaults = {
            outputFormat: "rapidJSON"
        };
        const readonly = {
            version: APIClient.API_VERSION
        };
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `apikey ${this.apiKey}`
        };
        const allParams = {
            ...defaults,
            ...params,
            ...readonly
        };
        const fullUrl = `${this.proxyUrl}/${url}`;

        const response = await window.fetch(`${fullUrl}?${(new URLSearchParams(allParams)).toString()}`, {
            headers: headers
        });
        return await response.json();
    }

    async getStops(query: string): Promise<StopFinderResponse> {
        return await this.performRequest("tp/stop_finder", {
            coordOutputFormat: TPCoordOutputFormat.EPSG_4326,
            type_sf: TPStopType.Stop,
            name_sf: query,
            TfNSWSF: true
        });
    }

    async getTrips(stopOrigin: StopFinderLocation, stopDestination: StopFinderLocation): Promise<TripRequestResponse> {
        return await this.performRequest("tp/trip", {
            coordOutputFormat: TPCoordOutputFormat.EPSG_4326,
            depArrMacro: "dep",
            type_origin: "any",
            type_destination: "any",
            name_origin: stopOrigin.id,
            name_destination: stopDestination.id,
            calcNumberOfTrips: 6,
            TfNSWTR: true
        });
    }
}

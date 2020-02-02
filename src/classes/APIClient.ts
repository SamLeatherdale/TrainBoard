import {TPStopType, TPCoordOutputFormat} from "./types";
import {StopFinderResponse} from "../models/TripPlanner/stopFinderResponse";

export default class APIClient {
    static readonly API_VERSION = "10.2.1.42";
    static readonly API_URL = "https://api.transport.nsw.gov.au/v1";
    apiKey = "";
    readonly proxyUrl;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
        this.proxyUrl = `http://${process.env.REACT_APP_PROXY_HOST}:${process.env.REACT_APP_PROXY_PORT}/${APIClient.API_URL}`;
        //this.proxyUrl = `https://crossorigin.me/${APIClient.API_URL}`;
    }

    static getClient(): APIClient {
        let apiKey = process.env.REACT_APP_TFNSW_API_KEY as string;
        return new APIClient(apiKey);
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
            type_sf: TPStopType.Stop,
            name_sf: query,
            coordOutputFormat: TPCoordOutputFormat.EPSG_4326,
            TfNSWSF: true
        });
    }
}

import {FeedMessage} from "../models/GTFS/Feed";
import {ParsedVehiclePositionEntity} from "../models/GTFS/VehiclePositions";
import {VehiclePositionEntity} from "../models/GTFS/VehiclePositions";
import ParsedTripId from "./ParsedTripId";
import {TPStopType, TPCoordOutputFormat, TypedObj} from "./types";
import {StopFinderResponse} from "../models/TripPlanner/stopFinderResponse";
import {StopFinderLocation} from "../models/TripPlanner/stopFinderLocation";
import {TripRequestResponse} from "../models/TripPlanner/tripRequestResponse";
import GTFS from "gtfs-realtime-bindings";
import {StopFinderLocationMode} from "../models/TripPlanner/custom/stopFinderLocationMode";

export default class APIClient {
    static readonly API_VERSION = "10.2.1.42";
    static readonly API_URL = "https://api.transport.nsw.gov.au/v1";
    apiKey = "";
    readonly proxyUrl;

    constructor(apiKey: string, proxyUrl: string) {
        this.apiKey = apiKey;
        this.proxyUrl = APIClient.getProxiedUrl(proxyUrl, APIClient.API_URL);
    }

    static getProxiedUrl(proxy: string, url: string): string {
        return `${proxy}${url}`;
    }

    async performJsonRequest(url: string, params: TypedObj<any> = {}): Promise<any> {
        const allParams = {
            outputFormat: "rapidJSON",
            ...params,
            version: APIClient.API_VERSION
        };
        const headers = {
            'Content-Type': 'application/json',
        };
        const response = await this.performRequest(url, allParams, headers);
        return response.json();
    }

    async performProtobufRequest(url: string, params: TypedObj<any> = {}): Promise<Uint8Array> {
        const headers = {
            'Content-Type': 'application/x-google-protobuf'
        };
        const response = await this.performRequest(url, params, headers);
        const arrayBuffer = await response.arrayBuffer();
        return new Uint8Array(arrayBuffer);
    }

    async performRequest(url: string, params: TypedObj<any>, headers: TypedObj<string>): Promise<Response> {
        headers = {
            ...headers,
            'Authorization': `apikey ${this.apiKey}`
        };
        const fullUrl = `${this.proxyUrl}/${url}`;

        return window.fetch(`${fullUrl}?${(new URLSearchParams(params)).toString()}`, {
            headers: headers
        }).then(response => {
            if (!response.ok) {
                throw new Error(`Fetch failed: HTTP ${response.status} ${response.statusText}`);
            }
            return response;
        });
    }

    async getStops(query: string): Promise<StopFinderResponse> {
        return await this.performJsonRequest("tp/stop_finder", {
            coordOutputFormat: TPCoordOutputFormat.EPSG_4326,
            type_sf: TPStopType.Stop,
            name_sf: query,
            TfNSWSF: true
        });
    }

    async getTrainStops(query: string): Promise<StopFinderLocation[]> {
        const results = await this.getStops(query);
        return results.locations.filter(location => location.modes?.includes(StopFinderLocationMode.Train));
    }

    /**
     * Uses the _Trip Planner_ API.
     * @see https://opendata.transport.nsw.gov.au/dataset/trip-planner-apis
     */
    async getTrips(stopOrigin: StopFinderLocation, stopDestination: StopFinderLocation, tripCount: number): Promise<TripRequestResponse> {
       return await this.performJsonRequest("tp/trip", {
            coordOutputFormat: TPCoordOutputFormat.EPSG_4326,
            depArrMacro: "dep",
            type_origin: "any",
            type_destination: "any",
            name_origin: stopOrigin.id,
            name_destination: stopDestination.id,
            calcNumberOfTrips: tripCount,
            TfNSWTR: true
        });
    }

    /**
     * Uses the _Public Transport - Realtime Vehicle Positions_ API.
     * @see https://opendata.transport.nsw.gov.au/dataset/public-transport-realtime-vehicle-positions
     */
    async getGTFSRealtime(tripIds: string[] = []): Promise<ParsedVehiclePositionEntity[]> {
        const body = await this.performProtobufRequest("gtfs/vehiclepos/sydneytrains");
        const feed: FeedMessage<VehiclePositionEntity> = GTFS.transit_realtime.FeedMessage.decode(body);

        let entities = feed.entity;
        const parsedTripIds: string[] = tripIds.map(tripId => new ParsedTripId(tripId).toEqualityString());

        const map = new Map<string, ParsedVehiclePositionEntity>();
        for (const entity of entities) {
            const parsedTripId = new ParsedTripId(entity.vehicle.trip.tripId);
            const parsedEntity = entity as ParsedVehiclePositionEntity;
            parsedEntity.parsedTripId = parsedTripId;
            map.set(parsedTripId.toEqualityString(), parsedEntity);
        }

        if (parsedTripIds.length) {
            const filteredMap = new Map<string, ParsedVehiclePositionEntity>();
            for (const tripId of parsedTripIds) {
                const entity = map.get(tripId);
                if (entity) {
                    filteredMap.set(tripId, entity)
                }
            }
            return Array.from(filteredMap.values());
        }

        return Array.from(map.values());
    }
}

import { transit_realtime } from "../gen/proto";
import { ParsedVehiclePositionEntity } from "../models/GTFS/VehiclePositions";
import { StopFinderLocation } from "../models/TripPlanner/stopFinderLocation";
import { StopFinderResponse } from "../models/TripPlanner/stopFinderResponse";
import { TripRequestResponse } from "../models/TripPlanner/tripRequestResponse";

import { TransportModeId, transportModes } from "./LineType";
import ParsedTripId from "./ParsedTripId";
import { SettingsSet } from "./SettingsSet";
import { TPStopType, TPCoordOutputFormat, RealtimeRequest } from "./types";

export default class APIClient {
    static readonly API_VERSION = "10.6.14.22";
    static readonly API_URL = "https://api.transport.nsw.gov.au/v1";
    static readonly PROXY_URL = "https://cors-proxy.trainboard.workers.dev/";
    static readonly REALTIME_PROXY_URL = "https://tripwatch-proxy.samleatherdale.com/api";
    // static readonly PROXY_URL = "http://localhost:8787/";

    static getProxiedUrl(url: string): string {
        const params = new URLSearchParams();
        params.set("url", url);

        return `${this.PROXY_URL}?${params.toString()}`;
    }

    private async performJsonRequest(url: string, params: Record<string, any> = {}): Promise<any> {
        const allParams = {
            outputFormat: "rapidJSON",
            ...params,
            version: APIClient.API_VERSION,
        };
        const headers = {
            "Content-Type": "application/json",
        };
        const response = await this.performRequest(url, allParams, headers);
        return response.json();
    }

    private async performProtobufRequest(
        url: string,
        params: Record<string, any> = {}
    ): Promise<Uint8Array> {
        const headers = {
            "Content-Type": "application/x-google-protobuf",
        };
        const response = await this.performRequest(url, params, headers);
        const arrayBuffer = await response.arrayBuffer();
        return new Uint8Array(arrayBuffer);
    }

    private async performRequest(
        url: string,
        params: Record<string, any>,
        headers: Record<string, string>
    ): Promise<Response> {
        const fullUrl = APIClient.getProxiedUrl(
            `${APIClient.API_URL}/${url}?${new URLSearchParams(params).toString()}`
        );

        const response = await window.fetch(fullUrl, {
            headers: headers,
        });
        if (!response.ok) {
            throw new Error(`Fetch failed: HTTP ${response.status} ${response.statusText}`);
        }
        return response;
    }

    async getStops(query: string): Promise<StopFinderResponse> {
        return await this.performJsonRequest("tp/stop_finder", {
            coordOutputFormat: TPCoordOutputFormat.EPSG_4326,
            type_sf: TPStopType.Stop,
            name_sf: query,
            TfNSWSF: true,
        });
    }

    async getStopsByMode(
        query: string,
        excludedModes: TransportModeId[]
    ): Promise<StopFinderLocation[]> {
        const results = await this.getStops(query);
        const includedModeIds = new Set(
            Object.values(transportModes)
                .map((mode) => mode.id)
                .filter((mode) => !excludedModes.includes(mode))
        );
        return results.locations.filter((location) =>
            location.productClasses?.some((product) => includedModeIds.has(product))
        );
    }

    /**
     * Uses the _Trip Planner_ API.
     * @see https://opendata.transport.nsw.gov.au/dataset/trip-planner-apis
     */
    async getTrips(
        stopOrigin: string,
        stopDestination: string,
        settings: Pick<SettingsSet, "tripCount" | "excludedModes">
    ): Promise<TripRequestResponse> {
        const params = {
            coordOutputFormat: TPCoordOutputFormat.EPSG_4326,
            depArrMacro: "dep",
            type_origin: "any",
            type_destination: "any",
            name_origin: stopOrigin,
            name_destination: stopDestination,
            calcNumberOfTrips: settings.tripCount,
            ...this.getExcludedModesOptions(settings.excludedModes),
        };
        return await this.performJsonRequest("tp/trip", params);
    }

    private getExcludedModesOptions(excludedModes: TransportModeId[]): Record<string, string> {
        const options: Record<string, string> = {};
        if (excludedModes.length) {
            options["excludedMeans"] = "checkbox";
        }
        excludedModes.forEach((mode) => {
            options[`exclMOT_${mode}`] = "1";
        });
        return options;
    }

    /**
     * Uses the _Public Transport - Realtime Vehicle Positions_ API.
     * @see https://opendata.transport.nsw.gov.au/dataset/public-transport-realtime-vehicle-positions
     */
    async getGTFSRealtimePosition(tripIds: string[] = []): Promise<ParsedVehiclePositionEntity[]> {
        const body = await this.performProtobufRequest("gtfs/vehiclepos/sydneytrains");
        const GTFS = await import("gtfs-realtime-bindings");
        const feed = GTFS.transit_realtime.FeedMessage.decode(body);

        let entities = feed.entity;
        const parsedTripIds: string[] = tripIds.map((tripId) =>
            new ParsedTripId(tripId).toEqualityString()
        );

        const map = new Map<string, ParsedVehiclePositionEntity>();
        for (const entity of entities) {
            const parsedTripId = new ParsedTripId(entity?.vehicle?.trip?.tripId || "");
            const parsedEntity = entity as ParsedVehiclePositionEntity;
            parsedEntity.parsedTripId = parsedTripId;
            map.set(parsedTripId.toEqualityString(), parsedEntity);
        }

        if (parsedTripIds.length) {
            const filteredMap = new Map<string, ParsedVehiclePositionEntity>();
            for (const tripId of parsedTripIds) {
                const entity = map.get(tripId);
                if (entity) {
                    filteredMap.set(tripId, entity);
                }
            }
            return Array.from(filteredMap.values());
        }

        return Array.from(map.values());
    }

    async getGTFSRealtime(realtimeRequests: RealtimeRequest[]): Promise<transit_realtime.ApiResponse> {
        const response = await fetch(APIClient.REALTIME_PROXY_URL, {
            method: "POST",
            body: JSON.stringify({
                requests: realtimeRequests,
            }),
        });
        const body = await response.arrayBuffer();
        const apiResponse = transit_realtime.ApiResponse.decode(new Uint8Array(body));
        return apiResponse;
    }
}

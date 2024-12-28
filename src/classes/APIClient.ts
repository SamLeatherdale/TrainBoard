import { transit_realtime } from "../gen/proto";
import { ParsedVehiclePositionEntity } from "../models/GTFS/VehiclePositions";
import { CancelStatus, getCancelStatus } from "../models/TripPlanner/custom/CancelStatus";
import { TPJourney } from "../models/TripPlanner/custom/TPJourney";
import { convertToNoRealtimeTPLeg, TPLeg } from "../models/TripPlanner/custom/TPLeg";
import { convertToNoRealtimeTPLegStop, TPLegStop } from "../models/TripPlanner/custom/TPLegStop";
import { TPResponse } from "../models/TripPlanner/custom/TPResponse";
import { StopFinderLocation } from "../models/TripPlanner/stopFinderLocation";
import { StopFinderResponse } from "../models/TripPlanner/stopFinderResponse";
import { TripRequestResponse } from "../models/TripPlanner/tripRequestResponse";
import { TripRequestResponseJourney } from "../models/TripPlanner/tripRequestResponseJourney";
import { getDevApi } from "../util/env";

import { TransportModeId, transportModes } from "./LineType";
import ParsedTripId from "./ParsedTripId";
import { SettingsSet } from "./SettingsSet";
import { TPStopType, TPCoordOutputFormat, RealtimeRequest } from "./types";

export default class APIClient {
    static readonly API_VERSION = "10.6.14.22";
    static readonly API_URL = "https://api.transport.nsw.gov.au/v1";
    static readonly PROXY_URL = "https://cors-proxy.trainboard.workers.dev/";
    static readonly REALTIME_PROXY_URL = getDevApi()
        ? "http://localhost:3001/api"
        : "https://tripwatch-proxy.samleatherdale.com/api";

    static getProxiedUrl(url: string): string {
        const params = new URLSearchParams();
        params.set("url", url);

        return `${this.PROXY_URL}?${params.toString()}`;
    }

    private async performJsonRequest<T>(url: string, params: Record<string, any> = {}): Promise<T> {
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
        return await this.performJsonRequest<StopFinderResponse>("tp/stop_finder", {
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
    ): Promise<TPResponse> {
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
        const response = await this.performJsonRequest<TripRequestResponse>("tp/trip", params);
        if (!response.journeys?.length) {
            throw new Error(
                response.systemMessages?.length ? response.systemMessages[0].text : "No trips"
            );
        }
        return response;
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

    async getGTFSRealtime(journeys: TPJourney[]): Promise<TPJourney[]> {
        const realtimeRequests = this.getRealtimeRequests(journeys);
        const response = await fetch(APIClient.REALTIME_PROXY_URL, {
            method: "POST",
            body: JSON.stringify({
                requests: realtimeRequests,
            }),
        });
        const body = await response.arrayBuffer();
        const apiResponse = transit_realtime.ApiResponse.decode(new Uint8Array(body));
        return this.applyRealtimeToTrips(journeys, apiResponse);
    }

    private getRealtimeRequests(journeys: TripRequestResponseJourney[]) {
        return journeys.flatMap((journey) =>
            journey.legs
                .map((leg): RealtimeRequest | null => {
                    const tripId = leg.transportation?.properties?.RealtimeTripId;
                    const operator = leg.transportation?.operator?.id;
                    const mode = leg.transportation?.product?.class;
                    if (tripId && operator && mode) {
                        return {
                            mode,
                            id: tripId,
                            operator,
                        };
                    }
                    return null;
                })
                .filter((req): req is RealtimeRequest => req !== null)
        );
    }

    private applyRealtimeToTrips(
        journeys: TPJourney[],
        realtime: transit_realtime.ApiResponse
    ): TPJourney[] {
        return journeys.map((journey): TPJourney => {
            const legs = journey.legs.map((leg): TPLeg => {
                const noRealtimeLeg = convertToNoRealtimeTPLeg(leg);
                const realtimeId = leg.transportation?.properties?.RealtimeTripId;
                if (!realtimeId) return noRealtimeLeg;

                // Find matching realtime item
                const realtimeItem = realtime.items.find((item) => item.id === realtimeId);
                if (!realtimeItem?.message) return noRealtimeLeg;

                const message = realtimeItem.message;
                const entities = message.entity;

                if (!entities) return noRealtimeLeg;

                // Find realtime stops for origin and destination
                const originStop = this.findRealtimeStop(leg.origin.id, entities);
                const destinationStop = this.findRealtimeStop(leg.destination.id, entities);

                // Find exact trip match
                const exactTrip = entities.find((entity) =>
                    this.isExactTripMatch(entity, realtimeId)
                );
                const isCancelled =
                    exactTrip?.tripUpdate?.trip?.scheduleRelationship ===
                    transit_realtime.TripDescriptor.ScheduleRelationship.CANCELED;

                // Update stop sequence with realtime data
                const stopSequence = leg.stopSequence?.map((stop) => {
                    const realtimeStop = this.findRealtimeStop(stop.id, entities);
                    if (!realtimeStop) return convertToNoRealtimeTPLegStop(stop);

                    return {
                        ...stop,
                        hasRealtime: true,
                        isSkipped:
                            realtimeStop.scheduleRelationship ===
                            transit_realtime.TripUpdate.StopTimeUpdate.ScheduleRelationship.SKIPPED,
                    };
                });

                // Update origin with realtime data
                const updatedOrigin: TPLegStop = originStop
                    ? {
                          ...leg.origin,
                          departureTimeEstimated: originStop.departure?.delay
                              ? leg.origin.departureTimePlanned + originStop.departure.delay
                              : leg.origin.departureTimeEstimated,
                          hasRealtime: !!originStop.departure?.delay,
                          isSkipped:
                              originStop.scheduleRelationship ===
                              transit_realtime.TripUpdate.StopTimeUpdate.ScheduleRelationship
                                  .SKIPPED,
                      }
                    : leg.origin;

                // Update destination with realtime data
                let updatedDestination: TPLegStop = leg.destination;
                if (leg.isDepartureOnly) {
                    updatedDestination = {
                        ...leg.destination,
                        arrivalTimePlanned: updatedOrigin.departureTimePlanned,
                        arrivalTimeEstimated: updatedOrigin.departureTimeEstimated,
                        hasRealtime: updatedOrigin.hasRealtime,
                        isSkipped: updatedOrigin.isSkipped,
                    };
                } else if (destinationStop) {
                    updatedDestination = {
                        ...leg.destination,
                        arrivalTimeEstimated: destinationStop.arrival?.delay
                            ? leg.destination.arrivalTimePlanned + destinationStop.arrival.delay
                            : leg.destination.arrivalTimeEstimated,
                        hasRealtime: !!destinationStop.arrival?.delay,
                        isSkipped:
                            destinationStop.scheduleRelationship ===
                            transit_realtime.TripUpdate.StopTimeUpdate.ScheduleRelationship.SKIPPED,
                    };
                }

                const isSkipped =
                    updatedOrigin.isSkipped === true || updatedDestination.isSkipped === true;

                return {
                    ...leg,
                    origin: updatedOrigin,
                    destination: updatedDestination,
                    stopSequence,
                    hasRealtime: true,
                    cancelStatus: getCancelStatus(isCancelled, isSkipped),
                };
            });

            return {
                ...journey,
                legs,
                hasRealtime: legs.some((leg) => leg.hasRealtime),
                cancelStatus: getCancelStatus(
                    legs.some((leg) => leg.cancelStatus === CancelStatus.CANCELLED),
                    legs.some((leg) => leg.cancelStatus === CancelStatus.SKIPPED)
                ),
            };
        });
    }

    private findRealtimeStop(
        stopId: string,
        entities: transit_realtime.IFeedEntity[]
    ): transit_realtime.TripUpdate.IStopTimeUpdate | null {
        for (const entity of entities) {
            const stopUpdate = entity.tripUpdate?.stopTimeUpdate?.find(
                (stop) => stop.stopId === stopId
            );
            if (stopUpdate) return stopUpdate;
        }
        return null;
    }

    private isExactTripMatch(entity: transit_realtime.IFeedEntity, realtimeId: string): boolean {
        const entityTripId = entity.tripUpdate?.trip?.tripId;
        if (!entityTripId) return false;

        if (entityTripId === realtimeId) {
            // For non-rail exact matches
            return true;
        }

        const parsedTripId = new ParsedTripId(realtimeId);
        const parsedEntityId = new ParsedTripId(entityTripId);

        return parsedEntityId.tripName === parsedTripId.tripName;
    }
}

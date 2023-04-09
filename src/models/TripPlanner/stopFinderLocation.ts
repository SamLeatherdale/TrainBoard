/**
 * Trip Planner
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: 1.0
 *
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { SimpleCoords } from "../../classes/types";

import { ParentLocation } from "./parentLocation";
import { StopFinderAssignedStop } from "./stopFinderAssignedStop";

/**
 * This element describes a single location that is returned in an `XML_STOPFINDER_REQUEST` request.
 */
export interface StopFinderLocation {
    /**
     * This is a unique ID for the returned location. Certain types of ID can be used for subsequent searches performed with `XML_STOPFINDER_REQUEST`, or can be used as the origin or destination in an `XML_TRIP_REQUEST2` request. The format of a location ID differs greatly, depending on the type of location it is.
     */
    id: string;
    /**
     * This is the long version of the location name, which may include the suburb or other information.
     */
    name: string;
    /**
     * This is the short version of the location name, which does not include the suburb or other information.
     */
    disassembledName: string;
    /**
     * Contains exactly two values: the first value is the latitude, the second value is the longitude.
     */
    coord?: SimpleCoords;
    /**
     * This is the type of location being returned. It may represent a stop or platform that a public transport service physically stops at for passenger boarding, or it may represent somebody's house. A value of `unknown` likely indicates bad data coming from the server. If a location is returned with this type, you can safely ignore it.
     */
    type: StopFinderLocation.TypeEnum;
    /**
     * This is the number of the property, included only if the `type` value is set to `singlehouse`. Note that it is a string, as it may include non-numeric characters.
     */
    buildingNumber?: string;
    /**
     * This is included only if the `type` value is set to `street` or `singlehouse`.
     */
    streetName?: string;
    /**
     * This is included only if the `type` value is set to `stop`. Contains a list of modes of transport that service this stop. This can be useful for showing relevant wayfinding icons when presenting users with a list of matching stops to choose from.  The following values may be present:  * `1`: Train * `4`: Light Rail * `5`: Bus * `7`: Coach * `9`: Ferry * `11`: School Bus
     */
    productClasses?: number[];
    /**
     * This value indicates how well the returned stop matches the search query. A higher number indicates a better match.
     */
    matchQuality: number;
    /**
     * Indicates whether or not this is the best match out of all the returned locations.
     */
    isBest: boolean;
    parent: ParentLocation;
    /**
     * This is a list of stops that are assigned to this location. This means if you're in the current location and want to catch public transport, these assigned stops are directly available to you.
     */
    assignedStops: Array<StopFinderAssignedStop>;
}
export namespace StopFinderLocation {
    export type TypeEnum =
        | "poi"
        | "singlehouse"
        | "stop"
        | "platform"
        | "street"
        | "locality"
        | "location"
        | "unknown";
    export const TypeEnum = {
        Poi: "poi" as TypeEnum,
        Singlehouse: "singlehouse" as TypeEnum,
        Stop: "stop" as TypeEnum,
        Platform: "platform" as TypeEnum,
        Street: "street" as TypeEnum,
        Locality: "locality" as TypeEnum,
        Location: "location" as TypeEnum,
        Unknown: "unknown" as TypeEnum,
    };
}

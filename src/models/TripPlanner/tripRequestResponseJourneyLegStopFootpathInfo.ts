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
import { TripRequestResponseJourneyLegStopFootpathInfoFootpathElem } from './tripRequestResponseJourneyLegStopFootpathInfoFootpathElem';

/**
 * Contains walking directions for a walking leg.
 */
export interface TripRequestResponseJourneyLegStopFootpathInfo { 
    /**
     * This indicates where in the leg the walking part of this legs occurs, since for some legs this is included with transportation on a vehicle. 
     */
    position?: TripRequestResponseJourneyLegStopFootpathInfo.PositionEnum;
    /**
     * This is approximately how long in seconds the walking instructions contained in this element take to perform. 
     */
    duration?: number;
    /**
     * This describes the specific instructions for the walking leg. 
     */
    footPathElem?: Array<TripRequestResponseJourneyLegStopFootpathInfoFootpathElem>;
}
export namespace TripRequestResponseJourneyLegStopFootpathInfo {
    export type PositionEnum = 'AFTER' | 'IDEST';
    export const PositionEnum = {
        AFTER: 'AFTER' as PositionEnum,
        IDEST: 'IDEST' as PositionEnum
    };
}
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
import { TripRequestResponseJourneyLeg } from './tripRequestResponseJourneyLeg';

/**
 * This element describes a single journey returned by XML_TRIP_REQUEST2
 */
export interface TripRequestResponseJourney { 
    /**
     * XXX
     */
    rating: number;
    /**
     * XXX
     */
    isAdditional: boolean;
    interchanges: number;
    /**
     * This element contains one or more legs that constitute the trip.
     */
    legs: Array<TripRequestResponseJourneyLeg>;
    /**
     * Contains fare options for this trip, including different prices depending on the type of traveller. 
     */
    fare: any;
}
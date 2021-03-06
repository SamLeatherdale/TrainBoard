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
import { StopFinderLocation } from './stopFinderLocation';
import { TripTransportation } from './tripTransportation';

/**
 * Corresponds to a single departure or arrival for the given stop. 
 */
export interface DepartureMonitorResponseStopEvent { 
    location?: StopFinderLocation;
    /**
     * A timestamp in `YYYY-MM-DDTHH:MM:SSZ` format
     */
    departureTimePlanned?: string;
    transportation?: TripTransportation;
}
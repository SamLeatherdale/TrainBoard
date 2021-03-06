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
import { RouteProduct } from './routeProduct';

/**
 * This element describes a route, including information about its route number, usual destination, route type and operator. 
 */
export interface TripTransportation { 
    /**
     * This is an ID that uniquely identifies this route. 
     */
    id?: string;
    /**
     * This contains the full name of the route. 
     */
    name?: string;
    /**
     * Contains a very short name for the route. 
     */
    disassembledName?: string;
    /**
     * Contains a short name for the route. 
     */
    number?: string;
    /**
     * Contains an ID for the icon that can be used for this route. Different values here are used to differentiate differents types of the same route type. For example, private ferries have a different wayfinding icon to ferries operated by Sydney Ferries. 
     */
    iconId?: number;
    /**
     * Contains a description of this route. 
     */
    description?: string;
    product?: RouteProduct;
    /**
     * This element describes the operator of this route.  
     */
    operator?: any;
    /**
     * This element contains information about where vehicles on this route terminate. 
     */
    destination?: any;
    /**
     * Contains additional properties about this route. 
     */
    properties?: {
        isTTB: boolean,
        tripCode: number,
        RealtimeTripId: string
    };
}
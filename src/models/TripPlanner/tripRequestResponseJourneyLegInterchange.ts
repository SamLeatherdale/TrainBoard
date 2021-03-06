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

/**
 * This object describes walking directions for interchanging between two consecutive legs. This occurs in the case when there's only a small distance between two transit legs, not enough to constitute a standalone walking leg.  
 */
export interface TripRequestResponseJourneyLegInterchange { 
    /**
     * This is a description of the interchange. Note that \"Fussweg\" is German for \"Footpath\". 
     */
    desc?: string;
    /**
     * This indicates the mode of travel for the interchange. Both `99` and `100` indicate walking. 
     */
    type?: number;
    /**
     * This is a list of coordinates that makes up the path of the interchange. 
     */
    coords?: Array<Array<number>>;
}
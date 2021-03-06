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
import { ErrorResponse } from './errorResponse';
import { StopFinderLocation } from './stopFinderLocation';

/**
 * This element contains the response for an `XML_STOPFINDER_REQUEST` request.
 */
export interface StopFinderResponse { 
    /**
     * The version of the API that provided the response. Note that if this value is different to above, then the returned data may be different than expected. You can set the expected version using the `version` request parameter.  
     */
    version?: string;
    error?: ErrorResponse;
    /**
     * An array of all locations that were found using the specified search input.
     */
    locations: Array<StopFinderLocation>;
}
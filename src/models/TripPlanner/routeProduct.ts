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
 * This element contains additional properties about the route.
 */
export interface RouteProduct {
    /**
     * XXX
     */
    name?: string;
    /**
     * This field indicates the type of the route, using the same values as elsewhere in this API.  * `1`: Train * `4`: Light Rail * `5`: Bus * `7`: Coach * `9`: Ferry * `11`: School Bus * `99`: Walking * `100`: Walking
     */
    class?: number;
    /**
     * This field is used by to determine which icon to use when displaying this affected route. It will typically match up with the `class` value.
     */
    iconId?: number;
}

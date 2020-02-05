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
 * Describes a parent location. Locations are hierarchical, mean a location has a parent, and a location may have any number of child locations. A parent location is often included with locations, which can help traverse the location tree. 
 */
export interface ParentLocation { 
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
     * This is the type of location being returned. It may represent a stop or platform that a public transport service physically stops at for passenger boarding, or it may represent somebody's house. A value of `unknown` likely indicates bad data coming from the server. If a location is returned with this type, you can safely ignore it. 
     */
    type: ParentLocation.TypeEnum;
    /**
     * In some cases, a parent location will also contain its parent (in other words, the grandparent of the initial location) 
     */
    parent: any;
}
export namespace ParentLocation {
    export type TypeEnum = 'poi' | 'singlehouse' | 'stop' | 'platform' | 'street' | 'locality' | 'location' | 'unknown';
    export const TypeEnum = {
        Poi: 'poi' as TypeEnum,
        Singlehouse: 'singlehouse' as TypeEnum,
        Stop: 'stop' as TypeEnum,
        Platform: 'platform' as TypeEnum,
        Street: 'street' as TypeEnum,
        Locality: 'locality' as TypeEnum,
        Location: 'location' as TypeEnum,
        Unknown: 'unknown' as TypeEnum
    };
}
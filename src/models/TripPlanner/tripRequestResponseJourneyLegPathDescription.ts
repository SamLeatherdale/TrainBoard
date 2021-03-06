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
 * Contains a single instruction for completing a walking leg associated with a journey leg.
 */
export interface TripRequestResponseJourneyLegPathDescription { 
    /**
     * Indicates the way you need to turn to execute this step of the path description. 
     */
    turnDirection?: TripRequestResponseJourneyLegPathDescription.TurnDirectionEnum;
    /**
     * Indicates what you have to do (in addition the turn `turnDirection`) to execute this step of the path description. 
     */
    manoeuvre?: TripRequestResponseJourneyLegPathDescription.ManoeuvreEnum;
    /**
     * This is a specific description of what to do. In some cases, this information is required in addition to the  other properties provided in this step.  
     */
    name?: string;
    /**
     * Contains exactly two values: the first value is the latitude, the second value is the longitude. This is the location where the instruction occurs. 
     */
    coord?: Array<number>;
    /**
     * The direction in degrees (0-359) of the skyDirection
     */
    skyDirection?: number;
    /**
     * This is the duration of this step in seconds. 
     */
    duration?: number;
    /**
     * This is the cumulative duration in seconds at the point of this step. 
     */
    cumDuration?: number;
    /**
     * This is the distance travelled in this step in metres. 
     */
    distance?: number;
    /**
     * This is the distance travelled upward in this step in metres 
     */
    distanceUp?: number;
    /**
     * This is the distance travelled downward in this step in metres 
     */
    distanceDown?: number;
    /**
     * This is the cumulative distance travelled in metres at the point of this step.
     */
    cumDistance?: number;
    /**
     * This field enables you to retrieve multiple coordinates from the `coords` property, starting from this index. 
     */
    fromCoordsIndex?: number;
    /**
     * This field enables you to retrieve multiple coordinates from the `coords` property, ending at this index. 
     */
    toCoordsIndex?: number;
}
export namespace TripRequestResponseJourneyLegPathDescription {
    export type TurnDirectionEnum = 'UNKNOWN' | 'STRAIGHT' | 'RIGHT' | 'LEFT' | 'SLIGHT_RIGHT' | 'SLIGHT_LEFT' | 'SHARP_LEFT' | 'SHARP_RIGHT';
    export const TurnDirectionEnum = {
        UNKNOWN: 'UNKNOWN' as TurnDirectionEnum,
        STRAIGHT: 'STRAIGHT' as TurnDirectionEnum,
        RIGHT: 'RIGHT' as TurnDirectionEnum,
        LEFT: 'LEFT' as TurnDirectionEnum,
        SLIGHTRIGHT: 'SLIGHT_RIGHT' as TurnDirectionEnum,
        SLIGHTLEFT: 'SLIGHT_LEFT' as TurnDirectionEnum,
        SHARPLEFT: 'SHARP_LEFT' as TurnDirectionEnum,
        SHARPRIGHT: 'SHARP_RIGHT' as TurnDirectionEnum
    };
    export type ManoeuvreEnum = 'LEAVE' | 'KEEP' | 'TURN' | 'ENTER' | 'CONTINUE';
    export const ManoeuvreEnum = {
        LEAVE: 'LEAVE' as ManoeuvreEnum,
        KEEP: 'KEEP' as ManoeuvreEnum,
        TURN: 'TURN' as ManoeuvreEnum,
        ENTER: 'ENTER' as ManoeuvreEnum,
        CONTINUE: 'CONTINUE' as ManoeuvreEnum
    };
}
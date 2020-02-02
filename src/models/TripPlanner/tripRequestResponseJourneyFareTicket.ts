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
 * Describes a single ticket associated with a given journey.
 */
export interface TripRequestResponseJourneyFareTicket { 
    /**
     * This ID uniquely identifies the ticket type, based on the of traveller, mode of transport and the time of day.  
     */
    id?: string;
    /**
     * This describes the type of fare, which will be for Opal card. 
     */
    name?: string;
    /**
     * Additional information about the ticket type. 
     */
    comment?: string;
    /**
     * The currency used for all pricing contained within this ticket. All prices are in Australian dollars (`AUD`). 
     */
    currency?: TripRequestResponseJourneyFareTicket.CurrencyEnum;
    /**
     * XXX
     */
    priceLevel?: string;
    /**
     * Total tariff amount for this ticket (i.e. not including extra charges such as station access fee). 'Brutto' means 'Gross' in German. 
     */
    priceBrutto?: number;
    /**
     * The net tariff amount for this ticket. This is currently at 0 as it related to the tax percentage. 
     */
    priceNetto?: number;
    /**
     * This is the amount of tax applied to the fare. Currently this will be 0 in all cases. 
     */
    taxPercent?: number;
    /**
     * This value contains a 0-based index of the starting leg for this fare. For example, if there are 3 legs and the first two are covered by a single fare and the final by another, there will be one ticket with a `fromLeg` of `0` and a `toLeg` of `1`, and the second will have a value of `2` for both `fromLeg` and `toLeg`.  
     */
    fromLeg?: number;
    /**
     * This value contains a 0-based index of the starting leg for this fare. For example, if there are 3 legs and the first two are covered by a single fare and the final by another, there will be one ticket with a `fromLeg` of `0` and a `toLeg` of `1`, and the second will have a value of `2` for both `fromLeg` and `toLeg`.  
     */
    toLeg?: number;
    /**
     * XXX
     */
    net?: string;
    /**
     * This is the type of traveller the ticket applies to.
     */
    person?: TripRequestResponseJourneyFareTicket.PersonEnum;
    /**
     * This indicates the class (e.g. first class, second class), but is not currently used. 
     */
    travellerClass?: string;
    /**
     * This describes how long the ticket is valid for. Not currently used.
     */
    timeValidity?: string;
    /**
     * This describes how long in minutes the ticket is valid for. Not currently used.
     */
    validMinutes?: number;
    /**
     * Whether or not the trip is short haul. Not currently used.
     */
    isShortHaul?: TripRequestResponseJourneyFareTicket.IsShortHaulEnum;
    /**
     * Whether or not the ticket allows you to make the return journey also. Not currently used.
     */
    returnsAllowed?: TripRequestResponseJourneyFareTicket.ReturnsAllowedEnum;
    /**
     * Whether or not the ticket is a single journey ticket only. Not currently used.
     */
    validForOneJourneyOnly?: TripRequestResponseJourneyFareTicket.ValidForOneJourneyOnlyEnum;
    /**
     * Whether or not the ticket will only work for a single operator. Not currently used.
     */
    validForOneOperatorOnly?: TripRequestResponseJourneyFareTicket.ValidForOneOperatorOnlyEnum;
    /**
     * The number of transfers allowed with this ticket. Not currently used.
     */
    numberOfChanges?: number;
    /**
     * Not currently used.
     */
    nameValidityArea?: string;
    /**
     * Describes additional information about this particular kind of ticket.
     */
    properties?: any;
}
export namespace TripRequestResponseJourneyFareTicket {
    export type CurrencyEnum = 'AUD';
    export const CurrencyEnum = {
        AUD: 'AUD' as CurrencyEnum
    };
    export type PersonEnum = 'ADULT' | 'CHILD' | 'SCHOLAR' | 'SENIOR';
    export const PersonEnum = {
        ADULT: 'ADULT' as PersonEnum,
        CHILD: 'CHILD' as PersonEnum,
        SCHOLAR: 'SCHOLAR' as PersonEnum,
        SENIOR: 'SENIOR' as PersonEnum
    };
    export type IsShortHaulEnum = 'YES' | 'NO' | 'UNKNOWN';
    export const IsShortHaulEnum = {
        YES: 'YES' as IsShortHaulEnum,
        NO: 'NO' as IsShortHaulEnum,
        UNKNOWN: 'UNKNOWN' as IsShortHaulEnum
    };
    export type ReturnsAllowedEnum = 'YES' | 'NO' | 'UNKNOWN';
    export const ReturnsAllowedEnum = {
        YES: 'YES' as ReturnsAllowedEnum,
        NO: 'NO' as ReturnsAllowedEnum,
        UNKNOWN: 'UNKNOWN' as ReturnsAllowedEnum
    };
    export type ValidForOneJourneyOnlyEnum = 'YES' | 'NO' | 'UNKNOWN';
    export const ValidForOneJourneyOnlyEnum = {
        YES: 'YES' as ValidForOneJourneyOnlyEnum,
        NO: 'NO' as ValidForOneJourneyOnlyEnum,
        UNKNOWN: 'UNKNOWN' as ValidForOneJourneyOnlyEnum
    };
    export type ValidForOneOperatorOnlyEnum = 'YES' | 'NO' | 'UNKNOWN';
    export const ValidForOneOperatorOnlyEnum = {
        YES: 'YES' as ValidForOneOperatorOnlyEnum,
        NO: 'NO' as ValidForOneOperatorOnlyEnum,
        UNKNOWN: 'UNKNOWN' as ValidForOneOperatorOnlyEnum
    };
}
/** Function that takes an array and a function
 * and returns a new array with the elements that pass the filter */
export function filterMap<T, U>(array: T[], map: (item: T) => U | undefined): U[] {
    return array.map((item) => map(item)).filter((item) => item !== undefined);
}

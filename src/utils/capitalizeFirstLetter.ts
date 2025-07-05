/**;
 *
 * @param string: string
 * @returns same string with first letter capitalized
 *
 */

export function capitalizeFirst(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

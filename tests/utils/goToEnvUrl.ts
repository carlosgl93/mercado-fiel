/**;
 *
 * @returns  returns a string with the url of the environment;
 *
 */

export function goToEnvUrl() {
  const env = process?.env?.VITE_ENV || import.meta?.env?.VITE_ENV;
  if (env !== 'dev' || env !== 'test') {
    return 'https://mercadofiel.cl/';
  } else {
    return 'http://localhost:3000/';
  }
}

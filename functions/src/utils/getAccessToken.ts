/**;
 *
 * @param credential: Credential
 * @returns  Returns
 *
 */
import { Credential } from 'firebase-admin/app';

export async function getAccessToken(credential: Credential) {
  const accessToken = await credential.getAccessToken().then((res) => res.access_token);
  return accessToken;
}

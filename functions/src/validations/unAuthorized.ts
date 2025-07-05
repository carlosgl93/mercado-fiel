import { IncomingHttpHeaders } from "http2";
import { Response } from 'express';


/**;
 * unAuthorized - Function to check if the request is authorized
 * @param  headers
 * @param  res
 * @returns  Returns void after sending a response with status 401 if the request is not authorized
 *
 */

export function unAuthorized(headers: IncomingHttpHeaders, res: Response) {
  const authToken = headers.authorization;
  if (!authToken) {
    res.status(401).send('Unauthorized');
    return;
  }
}

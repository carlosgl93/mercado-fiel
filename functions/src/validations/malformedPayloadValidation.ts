import * as logger from 'firebase-functions/logger';
import { Response } from 'express';

/**
 * Handles the case of a malformed payload by checking the presence of necessary email details.
 * Logs an error and sends a 400 Bad Request response if details are missing.
 *
 * @param body - The request body containing the email details.
 * @param body.templateName - The name of the email template to be used.
 * @param body.options - The email options, including the recipient address.
 * @param body.options.to - The recipient email address.
 * @param res - The response object to send back the HTTP response.
 */

export function malformedPayloadValidation(body: MalformedBody, res: Response) {
  const { templateName, options } = body;
  if (!body || !options || !templateName || !body.options.to) {
    logger.error(
      'Missing email details, in the request body. Did you forget to include the templateName or options with details?',
    );
    res.status(400).send('Bad Request: Missing email options');
    return;
  }
}

type MalformedBody = { templateName: string; options: { to: string } };

import { fetchAndCompileTemplate } from '../utils/prepareEmailTemplate';
import { sendEmailSettings } from '../utils/sendEmailSettings';
import { onRequest } from 'firebase-functions/v2/https';
import * as logger from 'firebase-functions/logger';
import { unAuthorized } from '../validations';
import { Handlebars } from '../handlebars';
import { app, getAuth } from '../index';
import { getEnvUrl } from '../utils';

export const sendVerificationEmail = onRequest(
  // func settings
  { cors: true, region: 'southamerica-west1', memory: '128MiB', maxInstances: 1 },
  // handler
  async ({ headers, body }, res) => {
    unAuthorized(headers, res);
    const { mailTransport } = sendEmailSettings();

    const { options } = body;
    const { to } = options;

    if (!body || !options || !to) {
      logger.error('Missing email options in the request body');
      res.status(400).send('Bad Request: Missing email options');
      return;
    }

    try {
      const template = await fetchAndCompileTemplate('verify-email.html');
      const redirectURL = `${getEnvUrl()}/email-verificado`;
      const link = await getAuth(app).generateEmailVerificationLink(to, {
        url: redirectURL,
      });

      const templateData = {
        EMAIL_VERIFICATION_LINK: link,
      };
      // Compile the template with Handlebars
      const compiledTemplate = Handlebars.compile(template);
      const populatedTemplate = compiledTemplate(templateData);
      options.html = populatedTemplate;
      mailTransport.sendMail(options, (error, info) => {
        if (error) {
          logger.error('There was an error while sending the email:', error);
          res.status(500).send(`Error sending email: ${error.message}`);
        } else {
          logger.info('Email sent to:', to);
          res.status(200).send(`Email sent ${info.response}`);
        }
      });
    } catch (error) {
      logger.error('There was an error while sending the email:', error);
      if (error instanceof Error) {
        res.status(500).send(`Error sending email ${error.message}`);
      }
    }
  },
);

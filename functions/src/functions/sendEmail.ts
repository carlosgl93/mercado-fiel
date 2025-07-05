import { Handlebars } from '../handlebars';
import * as memoryCache from 'memory-cache';
import { CACHE_EXPIRATION_TIME } from '../config';
import * as logger from 'firebase-functions/logger';
import { onRequest } from 'firebase-functions/v2/https';
import { malformedPayloadValidation } from '../validations';
import { fetchAndCompileTemplate, getEnvUrl } from '../utils';
import { sendEmailSettings } from '../utils/sendEmailSettings';

export const sendEmail = onRequest(
  {
    cors: true,
    region: 'southamerica-west1',
    memory: '128MiB',
    maxInstances: 1,
    timeoutSeconds: 15,
  },
  async ({ body }, res) => {
    logger.info('beggining sendEmail execution', body);
    // validations
    // unAuthorized(headers, res);
    malformedPayloadValidation(body, res);
    // settings
    const { mailTransport } = sendEmailSettings();
    const { templateName, options } = body;

    logger.info('Template name received:', templateName); // Log the template name

    try {
      const { to } = options;
      // checking cache for template
      let template = memoryCache.get(templateName);
      if (!template) {
        logger.info('TEMPLATE WAS NOT CACHED');
        // Template not found in cache, fetch from storage
        template = await fetchAndCompileTemplate(templateName);
        memoryCache.put(templateName, template, CACHE_EXPIRATION_TIME);
      }

      let templateData;
      const customerSupportPhone = process.env.CUSTOMER_SUPPORT_NUMBER;
      if (!customerSupportPhone) {
        throw new Error('Missing customer support phone env variable.');
      }
      switch (templateName) {
        case 'failed-verify-prestador.html':
          templateData = {
            firstname: body.firstname,
            customerSupportPhone: customerSupportPhone,
          };
          break;
        case 'verify-prestador.html':
          templateData = {
            firstname: body.firstname,
            redirect: `construir-perfil/servicios`,
          };
          break;
        case 'create-prestador.html':
          templateData = {
            firstname: body.firstname,
            redirect: `construir-perfil/servicios`,
          };
          break;
        case 'new-message.html':
          const { sentBy, recipientName, senderName } = body;
          console.log('sentBy', sentBy, 'recipientName', recipientName, 'senderName', senderName);
          templateData = {
            recipientName: recipientName,
            senderName: senderName,
            redirect:
              sentBy === 'user' ? `${getEnvUrl()}/prestador-inbox` : `${getEnvUrl()}/usuario-inbox`,
          };
          break;
        case 'scheduled-appointment.html':
          {
            const { providerName, customerName, serviceName, scheduledDate, scheduledTime } = body;
            templateData = {
              providerName,
              customerName,
              serviceName,
              scheduledDate,
              scheduledTime,
              redirect: `${getEnvUrl()}/ingresar`,
            };
          }
          break;
        case 'sesion-realizada.html':
          {
            const { providerName, customerName, serviceName } = body;
            templateData = {
              providerName,
              customerName,
              serviceName,
              redirect: `${getEnvUrl()}/ingresar`,
            };
          }
          break;
        case 'bank-details-missing.html':
          {
            const { recipientName } = body;
            templateData = {
              recipientName,
              redirect: `${getEnvUrl()}/construir-perfil/cuentaBancaria`,
            };
          }
          break;
        case 'send-support-email.html':
          {
            const { senderName, senderEmail, message } = body;
            templateData = {
              senderName,
              message,
              senderEmail,
            };
          }
          break;
        default:
          // Handle default case or throw an error if templateName is unexpected
          throw new Error(`Unsupported template name: ${templateName}`);
      }

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

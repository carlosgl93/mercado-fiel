import * as logger from 'firebase-functions/logger';
import { onRequest } from 'firebase-functions/v2/https';
import * as nodemailer from 'nodemailer';
import Mail = require('nodemailer/lib/mailer');

export const userPaidAppointment = onRequest(
  { cors: true, region: 'southamerica-west1' },
  ({ headers, body }, res) => {
    const email = process.env.EMAIL_USERNAME;
    const password = process.env.EMAIL_PASSWORD;
    const mailTransport = nodemailer.createTransport({
      host: 'mail.smtp2go.com',
      port: 465,
      secure: true,
      auth: {
        user: email,
        pass: password,
      },
    });
    const authToken = headers.authorization;
    if (!authToken) {
      res.status(401).send('Unauthorized');
      return;
    }

    const { userEmail, appointmentId } = body;

    if (!userEmail || !appointmentId) {
      res.status(400).send('Missing userEmail or appointmentId');
      return;
    }

    logger.info('userEmail, appointmentId', userEmail, appointmentId, { structuredData: true });

    logger.info('Sending email to user and admins about payment done', { structuredData: true });

    const mailOptions: Mail.Options = {
      from: 'Mercado Fiel <contacto@mercadofiel.cl>',
      to: 'contacto@mercadofiel.cl',
      subject: 'Usuario ha pagado una cita',
      text: `${userEmail} claimed to have paid for appointment ${appointmentId}.`,
      html: `<p>${userEmail} claimed to have paid for appointment ${appointmentId}.</p>`,
    };

    try {
      mailTransport.sendMail(mailOptions);
      logger.info('Email sent to:', mailOptions.to);
      res.status(200).send('Email sent');
    } catch (error) {
      logger.error('There was an error while sending the email:', error);
      if (error instanceof Error) {
        res.status(500).send(`Error sending email ${error.message}`);
      }
    }
  },
);

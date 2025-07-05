/**;
 *
 * Google cloud function that runs after the user has completed the payment process
 * with payku and updates the appointment status to paid and sends an email notification
 * to the provider with the appointment details
 *
 */

import axios from 'axios';
import dayjs from 'dayjs';
import { getFirestore } from '../index';
import * as logger from 'firebase-functions/logger';
import { onRequest } from 'firebase-functions/v2/https';
import { defaultEmailSender, paymentSettings, sendEmailUrl } from '../config';

export const transactionResultNotify = onRequest(
  {
    cors: true,
    region: 'southamerica-west1',
    memory: '128MiB',
    maxInstances: 1,
    timeoutSeconds: 15,
  },
  async ({ body, query, method }, res) => {
    if (method !== 'POST') {
      res.status(500).send(`Method ${method} not supported`);
    }
    if (method === 'OPTIONS') {
      logger.info('options running');
      res.send(200);
      return;
    }

    logger.info('beggining transaction result', body);
    const { status } = body;
    logger.info('query', query);
    const appointmentsIds: string = query.appointmentsIds as string;

    logger.info('NEW APPOINTMENTS ID PARAMETER', appointmentsIds);

    if (!status) {
      logger.error('there was no status within the body', body);
      res.status(400).send('Missing status in request body');
      return;
    }
    // validating if request has appointmentId
    if (!appointmentsIds) {
      logger.error('there was no appointmentId within the query', query);
      res.status(400).send('Missing document ID in request');
      return;
    }

    const ids = appointmentsIds.split('-');

    logger.info('appointmentsIds', ids);

    const appointmentInfo: Array<FirebaseFirestore.DocumentData | undefined> = [];
    const db = getFirestore();

    try {
      for (let i = 0; i < ids.length; i++) {
        const docRef = db.collection('appointments').doc(ids[i]);
        logger.info('retrieving appointment document with id:', ids[i]);
        const docSnapshot = await docRef.get();
        appointmentInfo?.push(docSnapshot.data());
        if (!docSnapshot.exists) {
          throw new Error('Appointment document does not exist');
        }
        if (status === 'success' && appointmentInfo?.[i]?.isPaid !== 'Pagado') {
          const updatedDoc = {
            paymentDate: dayjs().toString(),
            isPaid: 'Pagado',
            status: 'Pagada',
          };
          await docRef.update(updatedDoc);
          const paymentDocRef = db.collection('payments').doc(ids[i]);

          const paymentRecord = await paymentDocRef.get();
          if (!paymentRecord.exists) {
            const appointmentPaymentDate = dayjs();
            const paymentDueDate = appointmentPaymentDate
              .add(paymentSettings.providerPayAfterDays, 'day')
              .toString();
            await paymentDocRef.create({
              ...appointmentInfo?.[i],
              appointmentId: ids[i],
              paymentStatus: 'pending',
              paymentDate: appointmentPaymentDate.toString(),
              paymentDueDate,
              isPaid: 'Pagado',
              status: 'Pagada',
              amountToPay:
                appointmentInfo?.[i]?.servicio?.price * (1 - paymentSettings.appCommission),
            });
          }
          logger.info(`Appointment ${ids[i]} was successfully scheduled`);
        } else if (status === 'success' && appointmentInfo?.[i]?.isPaid === 'Pagado') {
          logger.info(`Appointment ${ids[i]} was already successfully scheduled`);
        }
      }
      res.status(200).send('Appointments updated successfully');
    } catch (error) {
      logger.error('error updating appointment', error);
      res.status(500).send(`Error updating appointment ${error}`);
      return;
    }

    try {
      logger.info('beginning email notification');
      const emailsCollectionRef = db.collection('emails');
      const emailSnap = await emailsCollectionRef
        .where('appointmentId', '==', appointmentsIds)
        .get();
      if (emailSnap.empty) {
        logger.info('beginning sending email notification');
        await axios.post(String(sendEmailUrl), {
          method: 'post',
          providerName: appointmentInfo?.[0]?.provider.firstname,
          customerName: appointmentInfo?.[0]?.customer.firstname,
          serviceName: appointmentInfo?.[0]?.servicio.name,
          scheduledDate: appointmentInfo?.map((a) => a?.scheduledDate).join(', '),
          scheduledTime: appointmentInfo?.map((a) => a?.scheduledTime).join(', '),
          templateName: 'scheduled-appointment.html',
          options: {
            from: defaultEmailSender,
            to: appointmentInfo?.[0]?.provider?.email,
            subject: 'Nueva sesión agendada',
            text:
              appointmentInfo && appointmentInfo.length > 1
                ? `Hola ${appointmentInfo?.[0]?.provider?.firstname}, tienes nuevas sesiones del 
            ${appointmentInfo?.[0]?.servicio.name} confirmadas para los días 
            ${appointmentInfo.map((a) => `${a?.scheduledDate} a las ${a?.scheduledTime}`)}
             con ${appointmentInfo?.[0]?.customer?.firstname} ${
                    appointmentInfo?.[0]?.customer?.lastname
                  }`
                : `
            Hola ${appointmentInfo?.[0]?.provider?.firstname}, tienes una nueva sesión 
            de ${appointmentInfo?.[0]?.servicio.name} confirmada para el día 
            ${appointmentInfo?.[0]?.scheduledDate} a las ${appointmentInfo?.[0]?.scheduledTime}
             con ${appointmentInfo?.[0]?.customer?.firstname} ${appointmentInfo?.[0]?.customer?.lastname}`,
          },
        });
        const emailRegistered = await emailsCollectionRef.add({
          appointmentId: appointmentsIds,
          sent: true,
          date: new Date(),
        });

        logger.info('email sent and record created', emailRegistered);
        return;
        // res.status(200).send('Email notification sent successfully');
      }
    } catch (error) {
      logger.error('error sending the email notification', error);
      // res.status(500).send('error sending the email notification');
      return;
    }
  },
);

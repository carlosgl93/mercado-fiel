import { getFirestore } from '../index';
import { pubsub } from 'firebase-functions';
import * as logger from 'firebase-functions/logger';
import dayjs from 'dayjs';

export const markSessionsReadyToPay = pubsub.schedule('every day 04:00').onRun(async () => {
  const db = getFirestore();
  try {
    const twentyFourHoursAgo = dayjs().subtract(24, 'hour').toISOString();
    logger.info(`24 hours ago: ${twentyFourHoursAgo}`);

    const appointmentsRef = db.collection('appointments');
    const paymentsRef = db.collection('payments');

    // Query for appointments
    const appointmentsConfirmedByProviderSnapshot = await appointmentsRef
      .where('status', '==', 'Esperando confirmación del cliente')
      .where('confirmedDoneByProvider', '==', true)
      .where('scheduledDateISO', '>=', twentyFourHoursAgo)
      .get();

    logger.info(`Found ${appointmentsConfirmedByProviderSnapshot.size} appointments to process.`);

    // Query for payments
    const paymentsConfirmedByProviderSnapshot = await paymentsRef
      .where('status', '==', 'Esperando confirmación del cliente')
      .where('confirmedDoneByProvider', '==', true)
      .where('scheduledDateISO', '>=', twentyFourHoursAgo)
      .get();

    logger.info(`Found ${paymentsConfirmedByProviderSnapshot.size} payments to process.`);

    if (
      appointmentsConfirmedByProviderSnapshot.empty &&
      paymentsConfirmedByProviderSnapshot.empty
    ) {
      logger.info('No appointments or payments found that meet the criteria.');
      return;
    }

    const batch = db.batch();

    // Process appointments
    appointmentsConfirmedByProviderSnapshot.forEach((doc) => {
      const appointmentRef = appointmentsRef.doc(doc.id);
      batch.update(appointmentRef, {
        paymentStatus: 'Ready to pay',
        confirmedByUser: false,
        status: 'Realizada',
      });
      logger.info(`Updated appointment ${doc.id}`);
    });

    // Process payments
    paymentsConfirmedByProviderSnapshot.forEach((doc) => {
      const paymentRef = paymentsRef.doc(doc.id);
      batch.update(paymentRef, {
        paymentStatus: 'Ready to pay',
        confirmedByUser: false,
        status: 'Realizada',
      });
      logger.info(`Updated payment ${doc.id}`);
    });

    await batch.commit();
    logger.info('Batch update successful.');
  } catch (error) {
    logger.error('Error auto-marking sessions as ready to pay:', error);
  }

  return null;
});

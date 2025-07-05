import { db } from '@/firebase';
import { PaymentRecord } from '../appointments';
import { collection, getDocs, query } from 'firebase/firestore';

export const getDuePayments = async (): Promise<PaymentRecord[]> => {
  try {
    const paymentsRef = collection(db, 'payments');
    // Create a Timestamp for the start of today
    // const now = new Date();
    // const startOfTodayTimestamp = Timestamp.fromDate(now);

    // Query for payments that are "Ready to pay" and due before today
    const duePaymentsQuery = query(
      paymentsRef,
      // where('paymentStatus', '==', 'Ready to pay'),
      // where('paymentDueDate', '<', startOfTodayTimestamp),
    );
    const querySnapshot = await getDocs(duePaymentsQuery);
    const docs: PaymentRecord[] = [];
    querySnapshot.forEach((doc) => docs.push(doc.data() as PaymentRecord));
    return docs;
  } catch (error) {
    throw new Error(
      `Failed to fetch appointment: ${error instanceof Error ? error.message : error}`,
    );
  }
};

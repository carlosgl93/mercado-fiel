/**;
 *
 * @param providerId: string
 * @param appointmentId: string
 * @param rating: number
 * @param comment?: string
 * @returns  void
 *
 */

import { db } from '@/firebase';
import {
  addDoc,
  collection,
  doc,
  runTransaction,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';

interface RateAppointment {
  providerId: string;
  appointmentId: string;
  rating: number;
  comment?: string;
}

export async function rateAppointment({
  appointmentId,
  providerId,
  rating,
  comment,
}: RateAppointment) {
  console.log('rating', appointmentId, providerId, rating, comment);
  // Reference to the provider document
  const providerDocRef = doc(db, 'providers', providerId);
  // Reference to the reviews subcollection under the provider
  const reviewsCollectionRef = collection(providerDocRef, 'reviews');
  const appointmentDocRef = doc(db, 'appointments', appointmentId);
  // const reviews

  try {
    // Add a new review document to the reviews subcollection
    await addDoc(reviewsCollectionRef, {
      appointmentId,
      rating,
      comment,
      createdAt: serverTimestamp(),
    });
    // Reference to the provider's reviews statistics document

    // Run a transaction to update the average rating and count
    await runTransaction(db, async (transaction) => {
      const reviewsStatsDoc = await transaction.get(providerDocRef);
      console.log('reviewsStatsDoc', reviewsStatsDoc);

      if (!reviewsStatsDoc.exists()) {
        console.log('provider doesnt exists');
        // If the document doesn't exist, create it with the initial values
        transaction.set(providerDocRef, {
          averageRating: rating,
          count: 1,
        });
      } else {
        console.log('provider exists, calculating rating and counter+1', reviewsStatsDoc.data());
        // If the document exists, update the average rating and count
        const currentAverage = reviewsStatsDoc.data().averageRating || 0;
        const currentCount = reviewsStatsDoc.data().ratingCounter || 0;

        const newCount = currentCount + 1;
        const newAverage = (currentAverage * currentCount + rating) / newCount;

        transaction.update(providerDocRef, {
          averageRating: newAverage,
          ratingCounter: newCount,
        });
      }
    });
    await updateDoc(appointmentDocRef, {
      rating,
    });
  } catch (error) {
    console.error('Error adding document: ', error);
    throw error;
  }
}

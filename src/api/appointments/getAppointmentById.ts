import { db } from '@/firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Appointment } from './scheduleAppointmentMutation';

/**
 * Fetches an appointment by its ID from the Firestore database.
 * @param id The unique identifier of the appointment to fetch.
 * @returns A promise that resolves to the appointment data as ScheduleServiceParams.
 * @throws Error if the appointment ID is missing or if fetching the appointment fails.
 */

export const getAppointmentByIdQuery = async (id: string): Promise<Appointment> => {
  if (!id) {
    throw new Error('missing appointment id');
  }
  try {
    const appointmentRef = doc(db, 'appointments', id);
    const querySnapshot = await getDoc(appointmentRef);
    const data = querySnapshot.data();
    if (!data) {
      throw new Error(`No appointment found for ID: ${id}`);
    }
    return data as Appointment;
  } catch (error) {
    throw new Error(
      `Failed to fetch appointment: ${error instanceof Error ? error.message : error}`,
    );
  }
};

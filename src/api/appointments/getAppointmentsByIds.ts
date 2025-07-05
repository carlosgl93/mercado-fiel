import { Appointment } from './scheduleAppointmentMutation';
import { getAppointmentByIdQuery } from './getAppointmentById';

/**
 * Fetches an appointment by its ID from the Firestore database.
 * @param id The unique identifier of the appointment to fetch.
 * @returns A promise that resolves to the appointment data as ScheduleServiceParams.
 * @throws Error if the appointment ID is missing or if fetching the appointment fails.
 */

export const getAppointmentsByIdsQuery = async (ids: string[]): Promise<Appointment[]> => {
  if (!ids || ids.length === 0) {
    throw new Error('missing appointments ids');
  }
  console.log({ ids });
  const promises: Promise<Appointment>[] = [];
  ids.forEach((id) => {
    promises.push(getAppointmentByIdQuery(id));
  });
  try {
    const docsSnaps = await Promise.all(promises);
    const results = docsSnaps.map((docSnap) => docSnap as Appointment);
    console.log({ results });
    return results;
  } catch (error) {
    throw new Error(
      `Failed to fetch appointment: ${error instanceof Error ? error.message : error}`,
    );
  }
};

import { useAuthNew } from './useAuthNew';
import { collection, doc, getDocs, query, setDoc, updateDoc } from 'firebase/firestore';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useRecoilState } from 'recoil';
import { notificationState } from '@/store/snackbar';
import { AvailabilityData } from '@/pages/ConstruirPerfil/Disponibilidad/ListAvailableDays';
import { availabilityState, editDisponibilidadState } from '@/store/construirPerfil/availability';
import { db } from '@/firebase/firebase';
import { prestadorState } from '@/store/auth/prestador';
import dayjs, { Dayjs } from 'dayjs';

const daysOfWeek = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
const sortAvailability = (data: AvailabilityData[]) =>
  [...data].sort((a, b) => {
    return daysOfWeek.indexOf(a.day.toLowerCase()) - daysOfWeek.indexOf(b.day.toLowerCase());
  });

async function fetchAvailability(prestadorId: string) {
  const availabilityRef = collection(db, 'providers', prestadorId, 'availability');
  const fetch = query(availabilityRef);
  const snapshot = await getDocs(fetch);
  return snapshot.docs.map((doc) => doc.data()) as AvailabilityData[];
}

const updateDisponibilidad = async (id: string) => {
  const providerRef = doc(db, 'providers', id);

  await updateDoc(providerRef, {
    'settings.disponibilidad': true,
  });
};

export const useDisponibilidadNew = () => {
  const [, setNotification] = useRecoilState(notificationState);
  const [availability, setAvailability] = useRecoilState(availabilityState);
  const [, setPrestadorState] = useRecoilState(prestadorState);
  const [editDisponibilidad, setEditDisponibilidad] = useRecoilState(editDisponibilidadState);
  const { prestador } = useAuthNew();
  const id = prestador?.id ?? '';
  const client = useQueryClient();

  const { error, isLoading, isError } = useQuery(
    ['availability', id],
    () => {
      if (!id) return;
      return fetchAvailability(id);
    },
    {
      enabled: !!id,
      onSuccess: (data) => {
        if (data) {
          const sortedAvailability = sortAvailability(data);
          setAvailability(sortedAvailability);
        }
      },
      onError: (error) => {
        setNotification({
          open: true,
          message:
            'Error al cargar disponibilidad, comprueba tu conexión a internet y recarga la página.',
          severity: 'error',
        });
        console.log('error', error);
      },
    },
  );

  const handleToggleDisponibilidadDay = (day: string) => {
    const newAvailability = availability.map((d) => {
      if (d.day === day) {
        return { ...d, isAvailable: !d.isAvailable };
      }
      return d;
    });
    setAvailability(newAvailability);
  };

  const handleTimeChange = (e: Dayjs, id: number, startOrEnd: 'startTime' | 'endTime') => {
    let showError = false;
    let errorMessage = '';
    setAvailability((prev) => {
      const newDisponibilidad = prev.map((day) => {
        if (day.id !== id) {
          return day;
        }

        const updatedTime = e.format('HH:mm');
        const existingTime = day.times[startOrEnd === 'startTime' ? 'endTime' : 'startTime'];

        // If updating start time, ensure it's before existing end time
        if (startOrEnd === 'startTime' && existingTime && e.isAfter(dayjs(existingTime, 'HH:mm'))) {
          console.error('Start time must be before end time');
          showError = true;
          errorMessage = 'La hora de inicio debe ser antes de la hora de término';
          // setNotification((prev) => ({
          //   ...prev,
          //   open: true,
          //   message: 'La hora de inicio debe ser antes de la hora de término',
          //   severity: 'error',
          // }));
          return day;
        }

        // If updating end time, ensure it's after existing start time
        if (startOrEnd === 'endTime' && existingTime && e.isBefore(dayjs(existingTime, 'HH:mm'))) {
          console.error('End time must be after start time');
          showError = true;
          errorMessage = 'La hora de término debe ser después de la hora de inicio';
          // setNotification((prev) => ({
          //   ...prev,
          //   open: true,
          //   message: 'La hora de término debe ser despues de la hora de inicio',
          //   severity: 'error',
          // }));
          return day;
        }

        const updatedDay = {
          ...day,
          id: day.id,
          times: {
            ...day.times,
            [startOrEnd]: updatedTime,
          },
        };
        return updatedDay;
      });

      return newDisponibilidad;
    });
    if (showError) {
      setNotification((prev) => ({
        ...prev,
        open: true,
        message: errorMessage,
        severity: 'error',
      }));
    }
  };

  const { mutate: handleSaveDisponibilidad, isLoading: saveDisponibilidadLoading } = useMutation(
    () => {
      updateDisponibilidad(id);
      return Promise.all(
        availability.map((a) => setDoc(doc(db, 'providers', id, 'availability', a.day), a)),
      );
    },
    {
      onSuccess: async () => {
        await client.invalidateQueries(['availability', 'prestador']);
        setPrestadorState((prev) => {
          if (!prev) return null;
          return { ...prev, settings: { ...prev.settings, disponibilidad: true } };
        });
        setEditDisponibilidad(() => false);
        setNotification({
          open: true,
          message: 'Disponibilidad guardada exitosamente',
          severity: 'success',
        });
      },
      onError: (error) => {
        console.error('Error saving availability:', error);
        setNotification({
          open: true,
          message: 'Error al guardar disponibilidad, intentalo de nuevo',
          severity: 'error',
        });
      },
    },
  );

  const handleEditDisponibilidad = () => {
    setEditDisponibilidad((prev) => !prev);
  };

  return {
    availability,
    error,
    isLoading,
    isError,
    editDisponibilidad,
    saveDisponibilidadLoading,
    setEditDisponibilidad,
    handleToggleDisponibilidadDay,
    handleTimeChange,
    handleSaveDisponibilidad,
    handleEditDisponibilidad,
  };
};

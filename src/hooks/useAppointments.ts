import { useQuery } from 'react-query';
import { interactedPrestadorState } from '../store/resultados/interactedPrestador';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
  getAllAppointments,
  getAppointmentByIdQuery,
  getAppointmentsByIdsQuery,
  getProviderAppointments,
  getTotalAppointmentsQuery,
  getUserAppointments,
} from '@/api/appointments';
import { useAuthNew } from './useAuthNew';
import {
  searchedAppointmentState,
  userAppointmentsState,
} from '@/store/appointments/userAppointmentsState';
import { notificationState } from '@/store/snackbar';
import { providerAppointmentsState } from '@/store/appointments/providerAppointmentsState';
import { paymentsGridPaginationModelState } from '@/store/backoffice/payments';
import { useState } from 'react';
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';

export const useAppointments = (appointmentsIds?: string) => {
  const interactedPrestador = useRecoilValue(interactedPrestadorState);
  const setUserAppointments = useSetRecoilState(userAppointmentsState);
  const setPrestadorAppointments = useSetRecoilState(providerAppointmentsState);
  const appointmentId = useRecoilValue(searchedAppointmentState);
  const paginationModel = useRecoilValue(paymentsGridPaginationModelState);
  const [lastDoc, setLastDoc] = useState<null | QueryDocumentSnapshot<DocumentData, DocumentData>>(
    null,
  );

  const setNotification = useSetRecoilState(notificationState);
  const { user, prestador } = useAuthNew();
  const providerId = interactedPrestador?.id ?? prestador?.id;
  const userId = user?.id;

  const {
    data: providersAppointments,
    isLoading: providersAppointmentsLoading,
    error: providersAppointmentsError,
  } = useQuery(
    ['providerAppointments', providerId],
    () => getProviderAppointments(providerId ?? ''),
    {
      enabled: !!providerId,
      onSuccess: (data) => {
        setPrestadorAppointments(data);
      },
      onError: () => {
        console.log('ERROR fetching provider appointments');
        setNotification({
          open: true,
          message: 'Hubo un error cargando tus sesiones, intentalo nuevamente',
          severity: 'error',
        });
      },
    },
  );

  const {
    data: userAppointments,
    isLoading: userAppointmentsLoading,
    error: userAppointmentsError,
  } = useQuery(['userAppointments', userId], () => getUserAppointments(userId ?? ''), {
    enabled: !!userId && user.role === 'user',
    onSuccess: (data) => {
      setUserAppointments(data);
    },
    onError: () => {
      console.log('ERROR fetching user appointments');

      setNotification({
        open: true,
        message: 'Hubo un error cargando tus sesiones, intentalo nuevamente',
        severity: 'error',
      });
    },
    refetchOnWindowFocus: false,
  });

  const {
    data: allAppointments,
    isLoading: allAppointmentsLoading,
    error: allAppointmentsError,
  } = useQuery(
    ['allAppointments', paginationModel.page],
    () => getAllAppointments(paginationModel, lastDoc),
    {
      onSuccess: (data) => {
        setLastDoc(data.lastVisible);
      },
      onError: () => {
        setNotification({
          open: true,
          message: 'Hubo un error cargando todas las sesiones',
          severity: 'error',
        });
      },
      refetchOnWindowFocus: false,
    },
  );

  const { data: getTotalAppointments, isLoading: getTotalAppointmentsIsLoading } = useQuery(
    ['getTotalAppointments'],
    () => getTotalAppointmentsQuery(),
    {
      onError: () => {
        setNotification({
          open: true,
          message: 'Hubo un error fetching total de sesiones',
          severity: 'error',
        });
      },
      refetchOnWindowFocus: false,
    },
  );

  const {
    data: getAppointmentById,
    isLoading: getAppointmentByIdIsLoading,
    error: getAppointmentByIdError,
  } = useQuery(['appointmentById', appointmentId], () => getAppointmentByIdQuery(appointmentId), {
    enabled: !!appointmentId,
    onError: () => {
      setNotification({
        open: true,
        message: 'Hubo un error buscando la sesion',
        severity: 'error',
      });
    },
    refetchOnWindowFocus: false,
  });

  const {
    data: multipleAppointments,
    isLoading: isLoadingMultipleAppointments,
    error: multipleAppointmentsError,
  } = useQuery(
    ['appointmentsByIds', appointmentsIds],
    () => getAppointmentsByIdsQuery((appointmentsIds && appointmentsIds.split('-')) || []),
    { enabled: !!appointmentsIds },
  );

  return {
    getAppointmentById,
    allAppointments: allAppointments?.appointments,
    allAppointmentsLoading,
    allAppointmentsError,
    providersAppointments,
    providersAppointmentsLoading,
    providersAppointmentsError,
    userAppointments,
    userAppointmentsLoading,
    userAppointmentsError,
    getAppointmentByIdIsLoading,
    getAppointmentByIdError,
    getTotalAppointments,
    getTotalAppointmentsIsLoading,
    multipleAppointments,
    isLoadingMultipleAppointments,
    multipleAppointmentsError,
  };
};

import { sendEmailApi } from '@/api';
import {
  paymentVerificationFailedMutation,
  savePaymentMutation,
  ScheduleAppointmentParams,
  verifyPaymentMutation,
} from '@/api/appointments';
import { getDuePayments } from '@/api/payments';
import { notificationState } from '@/store/snackbar';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useSetRecoilState } from 'recoil';
import { useAuth } from '../../hooks';

export const PaymentController = (appointment?: ScheduleAppointmentParams) => {
  const setNotification = useSetRecoilState(notificationState);
  const client = useQueryClient();
  const { user } = useAuth();

  const { data: duePayments, isLoading: duePaymentsIsLoading } = useQuery(
    'duePaymentsQuery',
    async () => await getDuePayments(),
  );

  const { mutate: savePayment, isLoading } = useMutation(savePaymentMutation, {
    onSuccess: () => {
      sendEmailApi({
        data: {
          from: 'Mercado Fiel <contacto@mercadofiel.cl>',
          to: 'contacto@mercadofiel.cl',
          subject: 'Usuario ha pagado una cita',
          text: `${user?.email} claimed to have paid for appointment ${appointment?.id}.`,
          html: `<p>${user?.email} claimed to have paid for appointment ${appointment?.id}.</p>`,
        },
      });
      client.invalidateQueries(['userAppointments', user?.id]);
      setNotification({
        open: true,
        message: 'Confirmaremos tu sesion en breve',
        severity: 'success',
      });
    },
  });

  const { mutate: verifyPayment, isLoading: isLoadingVerifyPayment } = useMutation(
    verifyPaymentMutation,
    {
      onSuccess: () => {
        client.invalidateQueries(['allAppointments']);
        setNotification({
          open: true,
          message: 'Sesión confirmada',
          severity: 'success',
        });
      },
    },
  );

  const { mutate: paymentVerificationFailed, isLoading: isLoadingPaymentVerificationFailed } =
    useMutation(paymentVerificationFailedMutation, {
      onSuccess: () => {
        client.invalidateQueries(['allAppointments']);
        setNotification({
          open: true,
          message: 'Sesión actualizada, el usuario será notificado',
          severity: 'success',
        });
      },
    });

  const handlePayment = () => {
    if (!appointment?.id) throw new Error('No appointment id provided');
    savePayment(appointment?.id);
  };

  const handleVerifyPayment = (appId: string) => {
    verifyPayment(appId);
  };

  const handlePaymentVerificationFailed = (appId: string) => {
    paymentVerificationFailed(appId);
  };

  return {
    isLoading,
    isLoadingVerifyPayment,
    isLoadingPaymentVerificationFailed,
    duePaymentsIsLoading,
    handlePayment,
    handleVerifyPayment,
    handlePaymentVerificationFailed,
    duePayments,
  };
};

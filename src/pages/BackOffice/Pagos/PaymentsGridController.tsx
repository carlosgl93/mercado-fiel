import { PaymentRecord } from '@/api/appointments';
import { getProviderBankDetails, notifyMissingBankDetails } from '@/api/cuentaBancaria';
import { markAsPaid } from '@/api/payments';
import { paymentSettings } from '@/config';
import { PaymentController } from '@/pages/Sesiones/PaymentController';
import {
  paymentDetailsParamsState,
  paymentsGridPaginationModelState,
  showPaymentsDetailsState,
} from '@/store/backoffice/payments';
import { notificationState } from '@/store/snackbar';
import { formatCLP } from '@/utils/formatCLP';
import InfoIcon from '@mui/icons-material/Info';
import { GridActionsCellItem, GridColDef, GridRowParams } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useRecoilState, useSetRecoilState } from 'recoil';

export const PaymentsGridController = () => {
  const [paginationModel, setPaginationModel] = useRecoilState(paymentsGridPaginationModelState);
  const [showPaymentsDetails, setShowPaymentsDetails] = useRecoilState(showPaymentsDetailsState);
  const [paymentDetailsParams, setPaymentDetailsParams] = useRecoilState(paymentDetailsParamsState);
  const setNotification = useSetRecoilState(notificationState);
  const client = useQueryClient();

  const {
    handleVerifyPayment,
    handlePaymentVerificationFailed,
    isLoadingVerifyPayment,
    isLoadingPaymentVerificationFailed,
    duePayments,
    duePaymentsIsLoading,
  } = PaymentController();

  const columns = useMemo<GridColDef<PaymentRecord>[]>(
    () => [
      { field: 'appointmentId', headerName: 'ID', width: 90 },
      {
        field: 'provider',
        valueGetter: (_value, row) => {
          return `${row?.provider.firstname} ${row?.provider.lastname}`;
        },
        headerName: 'Prestador',
        width: 150,
        editable: false,
      },
      {
        field: 'customer',
        valueGetter: (_value, row) => {
          return `${row.customer.firstname} ${row?.customer.lastname}`;
        },
        headerName: 'Cliente',
        width: 150,
        editable: false,
      },
      {
        field: 'servicePrice',
        valueGetter: (_value, row) => {
          return formatCLP(0);
        },
        headerName: 'Precio',
        width: 100,
        editable: false,
      },
      {
        field: 'platformFee',
        valueGetter: (_value, row) => {
          return formatCLP(+0 * (paymentSettings.appCommission - 1));
        },
        headerName: 'Comisión Mercado Fiel',
        width: 100,
        editable: false,
      },
      {
        field: 'to pay',
        headerName: 'Monto a pagar',
        valueGetter: (_value, row) => {
          return formatCLP(row.amountToPay);
        },
        width: 100,
        editable: false,
      },
      {
        field: 'isPaid',
        headerName: 'Estado de pago',
        valueGetter: (_value, row) => {
          if (row.paymentStatus === 'pending') {
            return 'No pagado';
          }
          return row.paymentStatus;
        },
        width: 150,
        editable: false,
      },
      {
        field: 'scheduledDate',
        headerName: 'Fecha Sesión',
        valueGetter: (_value, row) => {
          return dayjs(`${row.scheduledDate}${row.scheduledTime}`).format('DD/MM/YYYY HH:mm');
        },
        width: 150,
        editable: false,
      },
      {
        field: 'verifyPayment',
        type: 'actions',
        headerName: 'Acciones',
        getActions: (params: GridRowParams) => [
          <GridActionsCellItem
            key={params.row?.id}
            icon={<InfoIcon />}
            label="No pagado"
            onClick={() => handleOpenPaymentDetails(params.row)}
          />,
          // <GridActionsCellItem
          //   key={params.id}
          //   icon={<CancelOutlinedIcon sx={{ color: 'red' }} />}
          //   label="No pagado"
          //   onClick={() => handlePaymentVerificationFailed(params.row.id as string)}
          // />,
          // <GridActionsCellItem
          //   key={params.id}
          //   icon={<DoneOutlinedIcon sx={{ color: 'green' }} />}
          //   label="Verificado"
          //   onClick={() => handleVerifyPayment(params.row.id as string)}
          // />,
        ],
      },
    ],
    [handlePaymentVerificationFailed, handleVerifyPayment],
  );

  const { data: providerBankDetails, isLoading: providerBankDetailsIsLoading } = useQuery(
    ['providerBankDetails', paymentDetailsParams?.provider?.id],
    () => getProviderBankDetails(paymentDetailsParams?.provider?.id),
    {
      enabled: !!paymentDetailsParams?.provider?.id,
    },
  );

  const { mutate: markAsPaidMutation, isLoading: markAsPaidIsLoading } = useMutation(markAsPaid, {
    onSuccess() {
      setNotification({
        open: true,
        message: 'Pago marcado como pagado',
        severity: 'success',
      });
      setShowPaymentsDetails(!showPaymentsDetails);
      // invalidate query
      client.invalidateQueries(['duePaymentsQuery']);
    },
    onError() {
      setNotification({
        open: true,
        message: 'Hubo un error, intentalo nuevamente',
        severity: 'error',
      });
    },
  });

  const { mutate: notifyMissingBankDetailsMutation, isLoading: notifyMissingBankDetailsIsLoading } =
    useMutation(notifyMissingBankDetails, {
      onSuccess() {
        setNotification({
          open: true,
          message: 'Prestador notificado',
          severity: 'success',
        });
      },
      onError() {
        setNotification({
          open: true,
          message: 'Hubo un error, intentalo nuevamente',
          severity: 'error',
        });
      },
    });
  const handleOpenPaymentDetails = async (params: PaymentRecord) => {
    setPaymentDetailsParams(params);
    setShowPaymentsDetails(!showPaymentsDetails);
  };

  const handleMarkAsPaid = (id: string | undefined) => {
    markAsPaidMutation(id);
  };

  return {
    columns,
    paginationModel,
    isLoadingPaymentVerificationFailed,
    isLoadingVerifyPayment,
    duePayments,
    duePaymentsIsLoading,
    showPaymentsDetails,
    paymentDetailsParams,
    providerBankDetails,
    providerBankDetailsIsLoading,
    markAsPaidIsLoading,
    notifyMissingBankDetailsIsLoading,
    setPaginationModel,
    handleOpenPaymentDetails,
    handleMarkAsPaid,
    notifyMissingBankDetailsMutation,
  };
};

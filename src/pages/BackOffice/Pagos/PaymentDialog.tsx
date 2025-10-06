import { Box, Dialog } from '@mui/material';
import dayjs from 'dayjs';
import { PaymentsGridController } from './PaymentsGridController';

type PaymentDialogProps = {
  open: boolean;
  paymentDetails: null;
  onClose: (params: unknown) => void;
};

export const PaymentDialog = ({ open, paymentDetails, onClose }: PaymentDialogProps) => {
  const { markAsPaidIsLoading, handleMarkAsPaid, notifyMissingBankDetailsMutation } =
    PaymentsGridController();

  const today = dayjs();

  if (!paymentDetails) return null;

  const { amountToPay, appointmentId, paymentDueDate, provider } = paymentDetails;
  const paymentDisabledDueToDate = today.isBefore(paymentDueDate);

  return (
    <Dialog open={open} onClose={onClose}>
      <Box
        sx={{
          display: 'flex',
          m: '1rem 2rem',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          maxWidth: 'fit-content',
          backgroundColor: 'white',
          borderRadius: '1rem',
          padding: '1rem',
          textAlign: 'center',
        }}
      >
        {/* {true ? (
          <>
            <ButtonCTA
              variant="contained"
              sx={{
                mt: 4,
              }}
              onClick={() => handleMarkAsPaid(appointmentId)}
              // disabled if createdAt is 3 days before the rendered date of today
              disabled={markAsPaidIsLoading || paymentDisabledDueToDate}
            >
              {paymentDisabledDueToDate
                ? `Deshabilidato por que debe pagarse el ${paymentDueDate}`
                : 'Marcar como pagado'}
            </ButtonCTA>
          </>
        ) : (
          <ButtonCTA
            variant="contained"
            onClick={() => {
              console.log({ provider });
            }}
          >
            Notificar falta detalles bancarios
          </ButtonCTA>
        )} */}
      </Box>
    </Dialog>
  );
};

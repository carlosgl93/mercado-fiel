import { Box, Button, IconButton, Modal } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Text } from '@/components/StyledComponents';
import { formatCLP } from '@/utils/formatCLP';

type PaymentModalProps = {
  openPayment: boolean;
  handleClose: () => void;
  paymentAmount: string;
  handlePayment?: () => void;
};

export const PaymentModal = ({
  openPayment,
  handleClose,
  paymentAmount,
  handlePayment,
}: PaymentModalProps) => {
  return (
    <Modal open={openPayment} onClose={handleClose}>
      <Box
        sx={{
          display: 'flex',
          m: '1rem 2rem',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'start',
          backgroundColor: 'white',
          padding: '1rem',
          borderRadius: '1rem',
          textAlign: 'start',
        }}
      >
        <IconButton onClick={handleClose} sx={{ alignSelf: 'flex-end' }}>
          <CloseIcon />
        </IconButton>
        <Box
          sx={{
            textAlign: 'start',
            mb: '1rem',
          }}
        >
          <Text sx={{ textAlign: 'start' }} variant="body1" gutterBottom>
            Por favor, realiza el pago a la siguiente cuenta bancaria:
          </Text>
          <Text variant="body1">
            <b>Monto:</b>
          </Text>
          <Text>{formatCLP(+paymentAmount * 1.035)}</Text>
          <Text variant="body1">
            <b>Nombre:</b>
          </Text>
          <Text>Francisco Jose Durney Rios</Text>
          <Text variant="body1">
            <b>RUT:</b>
          </Text>
          <Text>17.085.092-0</Text>
          <Text variant="body1">
            <b>Banco:</b>
          </Text>
          <Text>Banco BICE</Text>
          <Text variant="body1">
            <b>Tipo de Cuenta:</b>
          </Text>
          <Text>Cuenta Corriente</Text>
          <Text variant="body1">
            <b>Número de Cuenta:</b> 21739138
          </Text>
          <Text variant="body1">
            <b>Email:</b> FCODURNEY@GMAIL.COM
          </Text>
          <Text
            variant="caption"
            sx={{
              fontSize: '0.8rem',
            }}
          >
            En caso de no incluir el email indicado, <b>no podremos corroborar el pago!.</b>
          </Text>
          <br />
          <Text
            variant="caption"
            sx={{
              fontSize: '0.8rem',
            }}
          >
            Mercado Fiel ofrece un <b>reembolso del 100% del valor de la compra</b> en caso de que
            el profesional no realice el servicio.
          </Text>
        </Box>
        <Button variant="contained" onClick={handlePayment}>
          Ya transferí
        </Button>
      </Box>
    </Modal>
  );
};

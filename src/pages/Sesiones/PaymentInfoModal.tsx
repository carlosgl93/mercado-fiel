import { Box, IconButton, Modal, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { TisPaid } from '@/api/appointments';

type PaymentInfoModalProps = {
  isPaid: TisPaid;
  openInfo: boolean;
  handleClose: () => void;
};

export const PaymentInfoModal = ({ isPaid, openInfo, handleClose }: PaymentInfoModalProps) => {
  if (!isPaid) {
    return (
      <Modal open={openInfo} onClose={handleClose}>
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
          <IconButton onClick={handleClose} sx={{ alignSelf: 'flex-end' }}>
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" component="h2" gutterBottom>
            Información importante
          </Typography>
          <Typography variant="body1" gutterBottom>
            Debes pagar antes de la sesión, sino esta <b>será automaticamente cancelada</b>.
          </Typography>
          <Typography variant="body1">
            Si por alguna razón externa a ti, la consulta llega a cancelarse o a no realizarse.{' '}
            <b>Mercado Fiel ofrece un reembolso del 100% del valor de la compra.</b>
          </Typography>
        </Box>
      </Modal>
    );
  } else {
    return (
      <Modal open={openInfo} onClose={handleClose}>
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
          <IconButton onClick={handleClose} sx={{ alignSelf: 'flex-end' }}>
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" component="h2" gutterBottom>
            Información importante
          </Typography>
          <Typography variant="body1" gutterBottom>
            <b>Tu transferencia no fue encontrada o el monto fue incorrecto</b>.
          </Typography>
          <Typography variant="body1">
            Revisa el email que usaste para enviar el comprobante de la transferencia
            (contacto@mercadofiel.cl) y verifica que el monto sea el correcto.
          </Typography>
        </Box>
      </Modal>
    );
  }
};

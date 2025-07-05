import { Button } from '@mui/material';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import { useNavigate } from 'react-router-dom';

const PerfilBackButton = () => {
  const router = useNavigate();

  return (
    <Button
      variant="outlined"
      startIcon={<ArrowBackIosNewOutlinedIcon />}
      onClick={() => router('/resultados')}
      sx={{
        my: '1rem',
        ml: '1rem',
        color: 'white',
        borderColor: 'white',
      }}
    >
      Atras
    </Button>
  );
};

export default PerfilBackButton;

import { Button, SxProps, Theme } from '@mui/material';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import { useNavigate } from 'react-router-dom';

type BackButtonProps = {
  to?: string;
  action?: (() => void | null) | undefined;
  displayText?: boolean;
  ignoreMargin?: boolean;
  style?: SxProps<Theme>;
};

const BackButton = ({ to, action, displayText = true, ignoreMargin, style }: BackButtonProps) => {
  const router = useNavigate();

  return (
    <Button
      variant="outlined"
      startIcon={<ArrowBackIosNewOutlinedIcon />}
      onClick={() => {
        if (action) {
          action();
        }
        to ? router(to) : router(-1);
      }}
      sx={{
        mb: ignoreMargin ? '' : '1rem',
        width: 'fit-content',
        ...style,
      }}
    >
      {displayText && 'Atras'}
    </Button>
  );
};

export default BackButton;

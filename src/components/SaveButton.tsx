import { Button } from '@mui/material';

type SaveButtonProps = {
  disabled?: boolean;
  style?: React.CSSProperties;
  fullWidth?: boolean;
};

export const SaveButton = ({ disabled, style, fullWidth }: SaveButtonProps) => {
  return (
    <Button
      variant="contained"
      fullWidth={fullWidth}
      sx={{
        marginTop: '2rem',
        ...style,
      }}
      type="submit"
      disabled={disabled}
    >
      Guardar
    </Button>
  );
};

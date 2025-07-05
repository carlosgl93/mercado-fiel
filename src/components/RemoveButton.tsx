import { Button, IconButton } from '@mui/material';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import { CenteredFlexBox } from './styled';

type RemoveButtonProps = {
  onClick: () => void;
  label?: string;
  labelPosition?: 'left' | 'right';
};

export const RemoveButton = ({ onClick, label, labelPosition = 'right' }: RemoveButtonProps) => {
  return (
    <CenteredFlexBox>
      {label && labelPosition === 'left' && (
        <Button
          startIcon={
            <RemoveCircleOutlineOutlinedIcon
              sx={{
                fontSize: 'inherit',
                color: 'primary.main',
                borderRadius: '50%',
              }}
            />
          }
          onClick={onClick}
        >
          {label}
        </Button>
      )}
      {!label && (
        <IconButton
          size="large"
          onClick={onClick}
          sx={{
            background: 'white',
            padding: '0.5rem',
          }}
        >
          <RemoveCircleOutlineOutlinedIcon
            sx={{
              fontSize: 'inherit',
              color: 'primary.main',
              borderRadius: '50%',
            }}
          />
        </IconButton>
      )}

      {label && labelPosition === 'right' && (
        <Button
          endIcon={
            <RemoveCircleOutlineOutlinedIcon
              sx={{
                fontSize: 'inherit',
                color: 'primary.main',
                borderRadius: '50%',
              }}
            />
          }
          onClick={onClick}
        >
          {label}
        </Button>
      )}
    </CenteredFlexBox>
  );
};

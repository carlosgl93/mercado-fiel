import { Button, IconButton } from '@mui/material';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { CenteredFlexBox } from './styled';

type AddButtonProps = {
  onClick: () => void;
  label?: string;
  labelPosition?: 'left' | 'right';
};

export const AddButton = ({ onClick, label, labelPosition = 'right' }: AddButtonProps) => {
  return (
    <CenteredFlexBox>
      {label && labelPosition === 'left' && (
        <Button
          startIcon={
            <AddCircleOutlineOutlinedIcon
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
          <AddCircleOutlineOutlinedIcon
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
            <AddCircleOutlineOutlinedIcon
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

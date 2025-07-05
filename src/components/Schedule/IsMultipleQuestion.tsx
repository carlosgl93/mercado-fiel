import { ColumnCenteredFlexBox, FlexBox } from '../styled';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import {
  InputLabel,
  Tooltip,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';

export const IsMultipleQuestion = ({
  isMultiple: isRecurring,
  handleCheckRecurring,
}: {
  isMultiple: boolean;
  handleCheckRecurring: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <ColumnCenteredFlexBox sx={{ gap: '1rem' }}>
    <FlexBox
      sx={{
        maxWidth: '80vw',
      }}
    >
      <InputLabel
        sx={{
          mr: {
            md: '1rem',
          },
          wordBreak: 'break-word', // Break words if necessary
          whiteSpace: 'normal', // Allow normal line breaks
          overflowWrap: 'break-word', // Break words to prevent overflow
        }}
        id="number-of-recurring-sessions-label"
      >
        ¿Quieres agendar más de una sesión?
      </InputLabel>
      <Tooltip
        title={
          <ColumnCenteredFlexBox>
            <p>Selecciona si necesitas agendar más de una sesión.</p>
            <p>
              Solo quedaran confirmadas el número de sesiones que dejes pagadas en este momento, el
              resto quedaran en estado de por confirmar.
            </p>
            <p>
              3 días antes de cada sesión recibiras un email con un link para pagar la siguiente
              sesión y así confirmarla.
            </p>
          </ColumnCenteredFlexBox>
        }
        arrow
      >
        <HelpOutlineIcon />
      </Tooltip>
    </FlexBox>

    <FormControl>
      <RadioGroup
        row
        aria-labelledby="number-of-recurring-sessions-label"
        name="number-of-recurring-sessions"
        value={isRecurring ? 'true' : 'false'}
        onChange={handleCheckRecurring}
        defaultValue="false"
      >
        <FormControlLabel value="true" control={<Radio />} label="Sí" />
        <FormControlLabel value="false" control={<Radio />} label="No" />
      </RadioGroup>
    </FormControl>
  </ColumnCenteredFlexBox>
);

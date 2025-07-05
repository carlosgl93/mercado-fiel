import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';

export const NumberOfSessionsQuestion = ({
  numberOfRecurringSessionsOptions,
  handleSelectHowManySessionsToSchedule,
}: {
  numberOfRecurringSessionsOptions: number[];
  handleSelectHowManySessionsToSchedule: (e: SelectChangeEvent<string>) => void;
}) => (
  <FormControl sx={{ mx: 'auto' }}>
    <InputLabel id="number-of-recurring-sessions-label">¿Cuantas sesiones necesitas?</InputLabel>
    <Select
      labelId="number-of-recurring-sessions-label"
      id="number-of-recurring-sessions"
      label="Selecciona el numero de sesiones a preagendar"
      onChange={handleSelectHowManySessionsToSchedule}
      sx={{ width: { xs: '75vw', sm: '50vw', md: '33vw' } }}
      defaultValue=""
    >
      <MenuItem value="" disabled>
        Selecciona el numero de sesiones:
      </MenuItem>
      {numberOfRecurringSessionsOptions.map((e) => (
        <MenuItem key={e} value={e}>
          {e}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

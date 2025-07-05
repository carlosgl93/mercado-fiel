import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';

export const HowManySessionsToConfirmQuestion = ({
  howManySessionsToSchedule,
  handleSelectHowManySessionsToConfirm,
}: {
  howManySessionsToSchedule: number | undefined;
  handleSelectHowManySessionsToConfirm: (e: SelectChangeEvent<number>) => void;
}) => (
  <FormControl>
    <InputLabel id="how-many-to-confirm-label">Sesiones a confirmar</InputLabel>
    <Select
      labelId="how-many-to-confirm-label"
      id="how-many-to-confirm"
      label="Sesiones a confirmar"
      onChange={handleSelectHowManySessionsToConfirm}
      sx={{ width: { xs: '75vw', sm: '50vw', md: '33vw' } }}
      defaultValue={1}
    >
      <MenuItem value="" disabled>
        Selecciona cuantas sesiones dejaras pagadas:
      </MenuItem>
      {Array.from({ length: howManySessionsToSchedule ? howManySessionsToSchedule : 0 }, (_, i) =>
        Number(i + 1),
      ).map((e) => (
        <MenuItem key={e} value={e}>
          {e}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

import { FormControl, InputLabel, Select, MenuItem, TextField, Box, Button } from '@mui/material';
import { serviceDurationOptions, ServicioController } from './ServicioController';
import { SubTitle } from '@/pages/PrestadorDashboard/StyledPrestadorDashboardComponents';
import { SaveButton } from '@/components/SaveButton';
import Loading from '@/components/Loading';
import { formatCLP } from '@/utils/formatCLP';

export const CreateServicio = () => {
  const {
    nombreServicio,
    tarifa,
    description,
    duration,
    handleNombreServicioChange,
    handleChangeDescription,
    handleChangeTarifa,
    handleSubmit,
    handleIsCreatingServicio,
    handleSelectDuration,
    saveServicioLoading,
  } = ServicioController();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mx: 'auto',
        gap: '1rem',
        my: '1rem',
        width: {
          xs: '75vw',
          sm: '50vw',
          md: 'fit-content',
        },
      }}
    >
      <SubTitle>Crea un servicio</SubTitle>
      {/* <StyledText>
        Dado tu clasificación de {serviceName ?? ''}, puedes crear los s servicios en la siguientes
        especialidades{' '}
      </StyledText> */}
      {saveServicioLoading ? (
        <Loading />
      ) : (
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            my: '1rem',
            width: {
              xs: '75vw',
              sm: '50vw',
              md: 'fit-content',
            },
          }}
        >
          {/* {prestadorServicio?.especialidades?.length && (
            <FormControl>
              <InputLabel id="service-speciality">
                Selecciona la especialidad del servicio
              </InputLabel>
              <Select
                labelId="service-speciality"
                id="speciality-select"
                value={especialidad}
                label="Selecciona la especialidad del servicio"
                onChange={handleChangeEspecialidad}
                sx={{
                  width: {
                    xs: '75vw',
                    sm: '50vw',
                    md: 'fit-content',
                  },
                }}
                defaultValue=""
              >
                <MenuItem value="">Selecciona una especialidad:</MenuItem>
                {prestadorServicio?.especialidades?.map((e) => (
                  <MenuItem key={e.id} value={e.especialidadName}>
                    {e.especialidadName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )} */}

          <TextField
            label="Nombre del servicio"
            type="text"
            value={nombreServicio}
            onChange={handleNombreServicioChange}
          />
          <TextField
            multiline
            rows={4}
            label="Descripción del servicio"
            type="text"
            value={description}
            onChange={handleChangeDescription}
          />
          <FormControl>
            <InputLabel id="service-duration-label">Duración del servicio</InputLabel>
            <Select
              labelId="service-duration-label"
              id="service-duration-select"
              defaultValue={15}
              value={duration}
              label="Duración del servicio"
              onChange={handleSelectDuration}
              sx={{
                width: '100%',
                // width: {
                //   xs: '75vw',
                //   sm: '50vw',
                //   md: 'fit-content',
                // },
              }}
            >
              <MenuItem value="">Selecciona una duración:</MenuItem>
              {serviceDurationOptions.map((e) => (
                <MenuItem key={e.value} value={e.value}>
                  {e.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Precio"
            type="number"
            placeholder={formatCLP(Number(tarifa))}
            value={tarifa}
            onChange={handleChangeTarifa}
            helperText="Sin puntos ni comas. Valor mínimo: 1000 CLP"
            error={Number(tarifa) < 1000}
          />

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Button onClick={handleIsCreatingServicio} variant="contained">
              Cancelar
            </Button>
            <SaveButton
              disabled={!tarifa || !nombreServicio || !duration}
              fullWidth={false}
              style={{ margin: 0 }}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

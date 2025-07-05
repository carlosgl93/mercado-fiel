import { TextField, Button, Box, styled, FormControlLabel, Checkbox } from '@mui/material';
import { useFieldArray, useForm } from 'react-hook-form';
import {
  Container,
  StyledTitle,
  SubTitle,
  Wrapper,
} from '@/pages/PrestadorDashboard/StyledPrestadorDashboardComponents';
import BackButton from '@/components/BackButton';
import { SaveButton } from '@/components/SaveButton';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { HistorialLaboralEntry, useHistorialLaboral } from '@/hooks/useHistorialLaboral';
import Loading from '@/components/Loading';
import { useEffect } from 'react';
import { Text } from '@/components/StyledComponents';

export type HistorialLaboralInputs = {
  historialLaboral: HistorialLaboralEntry[];
};

export const HistorialLaboral = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm<HistorialLaboralInputs>();
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: 'historialLaboral',
  });

  const {
    prestadorHistorialLaboral,
    getPrestadorHistorialLaboralLoading,
    postHistorialPrestadorLaboral,
    postHistorialPrestadorLaboralLoading,
    deleteHistorialEntryLoading,
    deleteHistorialEntryMutation,
  } = useHistorialLaboral();

  const onSubmit = (data: HistorialLaboralInputs) => {
    postHistorialPrestadorLaboral(data.historialLaboral);
  };

  const watchFields = watch('historialLaboral');
  const isAnyFieldEmpty = watchFields?.some((field: HistorialLaboralEntry) => {
    !field.empresa || !field.inicio || !field.titulo || (field.todavia === false && !field.final);
  });

  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  useEffect(() => {
    if ((prestadorHistorialLaboral ?? []).length > 0) {
      replace(
        prestadorHistorialLaboral?.map((item) => ({
          ...item,
          dbId: item.id,
          inicio: item.inicio?.split('T')[0],
          final: item.final?.split('T')[0],
        })) as HistorialLaboralEntry[],
      );
    }
  }, [prestadorHistorialLaboral]);

  if (
    getPrestadorHistorialLaboralLoading ||
    postHistorialPrestadorLaboralLoading ||
    deleteHistorialEntryLoading
  )
    return <Loading />;

  return (
    <Wrapper>
      <BackButton to="/construir-perfil" />
      <Container>
        <StyledTitle>Historial Laboral</StyledTitle>
        <SubTitle>Ingresa tu experiencia laboral relevante a tus servicios.</SubTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          {prestadorHistorialLaboral?.length ? (
            fields?.map((field, index) => {
              const inicioDate = watch(`historialLaboral.${index}.inicio`);
              return (
                <div key={field.id}>
                  <TextField
                    {...register(`historialLaboral.${index}.empresa`, {
                      required: 'Empresa es requerido',
                    })}
                    label="Empresa"
                    fullWidth
                    margin="normal"
                  />
                  {errors.historialLaboral &&
                    errors.historialLaboral[index] &&
                    errors.historialLaboral[index]?.empresa && (
                      <StyledErrorMessage>
                        {errors.historialLaboral[index]?.empresa?.message}
                      </StyledErrorMessage>
                    )}

                  <TextField
                    {...register(`historialLaboral.${index}.inicio`, {
                      validate: (value) =>
                        new Date(value) <= new Date() ||
                        'La fecha inicio no puede estar en el futuro',
                      required: 'Inicio es requerido',
                    })}
                    label="Inicio"
                    type="date"
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                  />
                  {errors.historialLaboral &&
                    errors.historialLaboral[index] &&
                    errors.historialLaboral[index]?.inicio && (
                      <StyledErrorMessage>
                        {errors.historialLaboral[index]?.inicio?.message}
                      </StyledErrorMessage>
                    )}
                  {watch().historialLaboral[index].final ? null : (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={watch().historialLaboral[index].todavia}
                          {...register(`historialLaboral.${index}.todavia`)}
                        />
                      }
                      label="Todavía trabajo aquí"
                    />
                  )}
                  {watch().historialLaboral[index].todavia ? null : (
                    <TextField
                      {...register(`historialLaboral.${index}.final`, {
                        validate: (value) =>
                          new Date(value) >= new Date(inicioDate) ||
                          'La fecha final no puede ser más reciente que la fecha de inicio',
                        required: 'Final es requerido',
                      })}
                      label="Final"
                      type="date"
                      fullWidth
                      margin="normal"
                      InputLabelProps={{ shrink: true }}
                    />
                  )}
                  {errors.historialLaboral &&
                    errors.historialLaboral[index] &&
                    errors.historialLaboral[index]?.final && (
                      <StyledErrorMessage>
                        {errors.historialLaboral[index]?.final?.message}
                      </StyledErrorMessage>
                    )}

                  <TextField
                    {...register(`historialLaboral.${index}.titulo`, {
                      required: 'Titulo es requerido',
                    })}
                    label="Titulo"
                    fullWidth
                    margin="normal"
                  />
                  {errors.historialLaboral &&
                    errors.historialLaboral[index] &&
                    errors.historialLaboral[index]?.titulo && (
                      <StyledErrorMessage>
                        {errors.historialLaboral[index]?.titulo?.message}
                      </StyledErrorMessage>
                    )}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Button
                      startIcon={<AddCircleOutlineOutlinedIcon />}
                      type="button"
                      onClick={() =>
                        append({ empresa: '', inicio: '', final: '', titulo: '', todavia: false })
                      }
                    >
                      Agregar
                    </Button>
                    <Button
                      startIcon={<DeleteOutlineOutlinedIcon />}
                      type="button"
                      onClick={() => {
                        if (fields.length === 0) return;
                        remove(index);
                        deleteHistorialEntryMutation(field.dbId as number);
                        if (fields.length === 1) {
                          append({
                            empresa: '',
                            inicio: '',
                            final: '',
                            titulo: '',
                            todavia: false,
                          });
                        }
                      }}
                    >
                      Eliminar
                    </Button>
                  </Box>
                </div>
              );
            })
          ) : (
            <>
              <TextField
                {...register(`historialLaboral.${0}.empresa`, {
                  required: 'Empresa es requerido',
                })}
                label="Empresa"
                fullWidth
                margin="normal"
              />
              {errors.historialLaboral &&
                errors.historialLaboral[0] &&
                errors.historialLaboral[0]?.empresa && (
                  <StyledErrorMessage>
                    {errors.historialLaboral[0]?.empresa?.message}
                  </StyledErrorMessage>
                )}
              <TextField
                {...register(`historialLaboral.${0}.inicio`, {
                  validate: (value) =>
                    new Date(value) <= new Date() || 'La fecha inicio no puede estar en el futuro',
                  required: 'Inicio es requerido',
                })}
                label="Inicio"
                type="date"
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />

              {errors.historialLaboral &&
                errors.historialLaboral[0] &&
                errors.historialLaboral[0]?.inicio && (
                  <StyledErrorMessage>
                    {errors.historialLaboral[0]?.inicio?.message}
                  </StyledErrorMessage>
                )}
              <TextField
                {...register(`historialLaboral.${0}.final`, {
                  validate: (value) =>
                    new Date(value) >= new Date(watch(`historialLaboral.${0}.inicio`)) ||
                    'La fecha final no puede ser más reciente que la fecha de inicio',
                  required: 'Final es requerido',
                })}
                label="Final"
                type="date"
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
              {errors.historialLaboral &&
                errors.historialLaboral[0] &&
                errors.historialLaboral[0]?.final && (
                  <StyledErrorMessage>
                    {errors.historialLaboral[0]?.final?.message}
                  </StyledErrorMessage>
                )}
              <TextField
                {...register(`historialLaboral.${0}.titulo`, {
                  required: 'Titulo es requerido',
                })}
                label="Titulo"
                fullWidth
                margin="normal"
              />
              {errors.historialLaboral &&
                errors.historialLaboral[0] &&
                errors.historialLaboral[0]?.titulo && (
                  <StyledErrorMessage>
                    {errors.historialLaboral[0]?.titulo?.message}
                  </StyledErrorMessage>
                )}
              <Button
                startIcon={<AddCircleOutlineOutlinedIcon />}
                type="button"
                onClick={() =>
                  append({ empresa: '', inicio: '', final: '', titulo: '', todavia: false })
                }
              >
                Add More
              </Button>
            </>
          )}
          <SaveButton
            disabled={
              postHistorialPrestadorLaboralLoading ||
              deleteHistorialEntryLoading ||
              getPrestadorHistorialLaboralLoading ||
              isAnyFieldEmpty
            }
          />
        </form>
      </Container>
    </Wrapper>
  );
};

export const StyledErrorMessage = styled(Text)(({ theme }) => ({
  textAlign: 'center',
  color: theme.palette.secondary.contrastText,
}));

import BackButton from '@/components/BackButton';
import { SaveButton } from '@/components/SaveButton';
import {
  Container,
  StyledTitle,
  SubTitle,
  Wrapper,
} from '@/pages/PrestadorDashboard/StyledPrestadorDashboardComponents';
import { Box, Button, TextField } from '@mui/material';
import { useFieldArray, useForm } from 'react-hook-form';
import { StyledErrorMessage } from '../HistorialLaboral/HistorialLaboral';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { useEducation } from '@/hooks/useEducation';
import Loading from '@/components/Loading';
import { useEffect } from 'react';

export type EducacionInputs = {
  id?: number;
  dbId?: number;
  institucion: string;
  titulo: string;
  inicio: string;
  final: string;
};

type EducacionFormArray = {
  educacion: EducacionInputs[];
};

export const EducacionFormacion = () => {
  const {
    educacionData,
    educacionIsLoading,
    saveEducacion,
    postEducacionLoading,
    deleteEducacionLoading,
    deleteEducacionMutation,
  } = useEducation();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm<EducacionFormArray>();

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: 'educacion',
  });

  const watchFields = watch('educacion');
  const isAnyFieldEmpty = watchFields?.some(
    (field: EducacionInputs) =>
      !field.institucion || !field.inicio || !field.final || !field.titulo,
  );

  const onSubmit = ({ educacion }: EducacionFormArray) => {
    saveEducacion(educacion);
  };

  useEffect(() => {
    if ((educacionData ?? []).length > 0) {
      replace(
        educacionData?.map((item) => ({
          ...item,
          dbId: item.id,
          inicio: item.inicio.split('T')[0],
          final: item.final.split('T')[0],
        })) as EducacionInputs[],
      );
    }
  }, [educacionData]);

  if (educacionIsLoading || deleteEducacionLoading || postEducacionLoading) return <Loading />;

  return (
    <Wrapper>
      <BackButton to="/construir-perfil" />
      <Container>
        <StyledTitle>Educación y formación</StyledTitle>
        <SubTitle>
          Si has estudiado o recibido entrenamiento incluyendo titulos universitarioss, cursos,
          diplomas o otras calificaciones (como por ejemplo, primeros auxilios).
        </SubTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          {educacionData?.length ? (
            fields?.map((field, index) => {
              const inicioDate = watch(`educacion.${index}.inicio`);

              return (
                <div key={field.id}>
                  <TextField
                    {...register(`educacion.${index}.institucion`, {
                      required: 'Institución es requerido',
                    })}
                    label="Institución"
                    fullWidth
                    margin="normal"
                  />
                  {errors.educacion &&
                    errors.educacion[index] &&
                    errors.educacion[index]?.institucion && (
                      <StyledErrorMessage>
                        {errors.educacion[index]?.institucion?.message}
                      </StyledErrorMessage>
                    )}

                  <TextField
                    {...register(`educacion.${index}.inicio`, {
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
                  {errors.educacion &&
                    errors.educacion[index] &&
                    errors.educacion[index]?.inicio && (
                      <StyledErrorMessage>
                        {errors.educacion[index]?.inicio?.message}
                      </StyledErrorMessage>
                    )}

                  <TextField
                    {...register(`educacion.${index}.final`, {
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
                  {errors.educacion &&
                    errors.educacion[index] &&
                    errors.educacion[index]?.final && (
                      <StyledErrorMessage>
                        {errors.educacion[index]?.final?.message}
                      </StyledErrorMessage>
                    )}

                  <TextField
                    {...register(`educacion.${index}.titulo`, {
                      required: 'Título es requerido',
                    })}
                    label="Titulo"
                    fullWidth
                    margin="normal"
                  />
                  {errors.educacion &&
                    errors.educacion[index] &&
                    errors.educacion[index]?.titulo && (
                      <StyledErrorMessage>
                        {errors.educacion[index]?.titulo?.message}
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
                      onClick={() => {
                        append({ institucion: '', inicio: '', final: '', titulo: '' });
                      }}
                    >
                      Agregar
                    </Button>
                    <Button
                      startIcon={<DeleteOutlineOutlinedIcon />}
                      type="button"
                      onClick={() => {
                        if (fields.length === 0) return;
                        remove(index);
                        deleteEducacionMutation(field.dbId as number);
                        if (fields.length === 1) {
                          append({ institucion: '', inicio: '', final: '', titulo: '' });
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
                {...register(`educacion.${0}.institucion`, {
                  required: 'Institucion es requerido',
                })}
                label="Institución"
                fullWidth
                margin="normal"
              />
              {errors.educacion && errors.educacion[0] && errors.educacion[0]?.institucion && (
                <StyledErrorMessage>{errors.educacion[0]?.institucion?.message}</StyledErrorMessage>
              )}
              <TextField
                {...register(`educacion.${0}.inicio`, {
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

              {errors.educacion && errors.educacion[0] && errors.educacion[0]?.inicio && (
                <StyledErrorMessage>{errors.educacion[0]?.inicio?.message}</StyledErrorMessage>
              )}
              <TextField
                {...register(`educacion.${0}.final`, {
                  validate: (value) =>
                    new Date(value) >= new Date(watch(`educacion.${0}.inicio`)) ||
                    'La fecha final no puede ser más reciente que la fecha de inicio',
                  required: 'Final es requerido',
                })}
                label="Final"
                type="date"
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
              {errors.educacion && errors.educacion[0] && errors.educacion[0]?.final && (
                <StyledErrorMessage>{errors.educacion[0]?.final?.message}</StyledErrorMessage>
              )}
              <TextField
                {...register(`educacion.${0}.titulo`, {
                  required: 'Titulo es requerido',
                })}
                label="Título"
                fullWidth
                margin="normal"
              />
              {errors.educacion && errors.educacion[0] && errors.educacion[0]?.titulo && (
                <StyledErrorMessage>{errors.educacion[0]?.titulo?.message}</StyledErrorMessage>
              )}
              <Button
                startIcon={<AddCircleOutlineOutlinedIcon />}
                type="button"
                onClick={() => append({ institucion: '', inicio: '', final: '', titulo: '' })}
              >
                Add More
              </Button>
            </>
          )}
          <SaveButton
            disabled={
              educacionIsLoading ||
              postEducacionLoading ||
              deleteEducacionLoading ||
              isAnyFieldEmpty
            }
          />
        </form>
      </Container>
    </Wrapper>
  );
};

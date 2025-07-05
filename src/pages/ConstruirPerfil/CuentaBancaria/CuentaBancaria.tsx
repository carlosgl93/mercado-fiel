import BackButton from '@/components/BackButton';
import Loading from '@/components/Loading';
import { SaveButton } from '@/components/SaveButton';
import { useCuentaBancaria } from '@/hooks/useCuentaBancaria';
import {
  BackButtonContainer,
  Container,
  StyledTitle,
  SubTitle,
  Wrapper,
} from '@/pages/PrestadorDashboard/StyledPrestadorDashboardComponents';
import LockIcon from '@mui/icons-material/Lock';
import { Box, TextField, styled } from '@mui/material';
import { useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { bancos, tiposDeCuenta } from './consts';

export type CuentaBancariaInputs = {
  banco: string;
  tipoCuenta: string;
  numeroCuenta: string;
  titular: string;
  rut: string;
};

export const CuentaBancaria = () => {
  const {
    mutateCuentaBancaria,
    postCuentaBancariaLoading,
    cuentaBancaria,
    getCuentaBancariaLoading,
  } = useCuentaBancaria();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm<CuentaBancariaInputs>({
    defaultValues: {
      banco: cuentaBancaria?.banco ?? '',
      numeroCuenta: cuentaBancaria?.numeroCuenta,
      rut: cuentaBancaria?.rut,
      tipoCuenta: cuentaBancaria?.tipoCuenta,
      titular: cuentaBancaria?.titular,
    },
  });

  useEffect(() => {
    if (cuentaBancaria) {
      for (const key in cuentaBancaria) {
        setValue(key as keyof CuentaBancariaInputs, cuentaBancaria[key] as string);
      }
    }
  }, [cuentaBancaria, setValue]);

  const onSubmit: SubmitHandler<CuentaBancariaInputs> = (data) => mutateCuentaBancaria(data);

  const isLoading = postCuentaBancariaLoading || getCuentaBancariaLoading;

  return (
    <Wrapper>
      <BackButtonContainer>
        <BackButton to="/construir-perfil" />
      </BackButtonContainer>
      <StyledTitle>Cuenta Bancaria</StyledTitle>
      <Container
        sx={{
          width: 'fit-content',
          p: '1.5rem',
        }}
      >
        <SubTitle>
          Para poder pagarte lo antes posible, ingresa tus datos bancarios para que Mercado Fiel
          pueda procesar pagos para ti departe de tus clientes.
        </SubTitle>
        <StyledPrivacyContainer>
          <IconLockContainer>
            <LockIcon />
          </IconLockContainer>
          <SubTitle>
            Tus detalles bancarios no seran mostrados en tu perfil y solo seran usados para procesar
            tus pagos por el equipo de Mercado Fiel.
          </SubTitle>
        </StyledPrivacyContainer>
        {isLoading ? (
          <Loading />
        ) : (
          <>
            <SmallerTitle>Agrega tus datos bancarios</SmallerTitle>
            <StyledForm onSubmit={handleSubmit(onSubmit)}>
              <StyledTextField
                // defaultValue={prestadorCuentaBancaria?.titular}
                label="Nombre del titular"
                {...register('titular', {
                  required: 'Debes indicar el nombre del titular.',
                  pattern: {
                    value: /^[a-zA-Z\s]+$/,
                    message: 'Nombre invalido: Solo se aceptan letras',
                  },
                })}
              />
              <StyledTextField
                label="RUT"
                {...register('rut', {
                  required: 'Debes indicar tu rut.',
                  pattern: {
                    value: /^[0-9]+-[0-9kK]{1}$/,
                    message: 'RUT invalido: Ingresalo con este formato 12345678-9',
                  },
                })}
                aria-invalid={errors.rut ? 'true' : 'false'}
              />
              <Controller
                name="banco"
                control={control}
                defaultValue=""
                rules={{
                  required: true,
                  validate: (value) => bancos.includes(value) || 'Banco no válido',
                }}
                render={({ field }) => (
                  <>
                    <StyledLabel htmlFor="banco">Banco</StyledLabel>
                    <StyledSelect {...field} name="banco">
                      <StyledOption value="">Seleccione un banco</StyledOption>
                      {bancos.map((banco) => (
                        <StyledOption key={banco} value={banco}>
                          {banco}
                        </StyledOption>
                      ))}
                    </StyledSelect>
                  </>
                )}
              />
              <Controller
                name="tipoCuenta"
                control={control}
                defaultValue=""
                rules={{
                  required: true,
                  validate: (value) => tiposDeCuenta.includes(value) || 'Tipo de cuenta invalida',
                }}
                render={({ field }) => (
                  <>
                    <StyledLabel htmlFor="tipoCuenta">Tipo de cuenta</StyledLabel>
                    <StyledSelect {...field} name="tipoCuenta">
                      <StyledOption value="">Seleccione un tipo de cuenta</StyledOption>
                      {tiposDeCuenta.map((cuenta) => (
                        <StyledOption key={cuenta} value={cuenta}>
                          {cuenta}
                        </StyledOption>
                      ))}
                    </StyledSelect>
                  </>
                )}
              />
              <StyledTextField
                label="Número de cuenta"
                {...register('numeroCuenta', {
                  required: 'Debes ingresar un numero de cuenta.',
                  pattern: {
                    value: /^[0-9]+$/,
                    message: 'Número de cuenta: Solo se aceptan numeros, sin espacios',
                  },
                })}
              />
              {Object.values(errors).map((e) => (
                <ErrorMessage key={e.message}>*** {e.message} ***</ErrorMessage>
              ))}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <SaveButton />
              </Box>
            </StyledForm>
          </>
        )}
      </Container>
    </Wrapper>
  );
};

const StyledPrivacyContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: '2rem',
  backgroundColor: theme.palette.background.default,
  '& > *': {
    marginBottom: '1rem',
  },
  borderRadius: '0.5rem',
  padding: '1rem',
  gap: '1rem',
}));

const IconLockContainer = styled(Box)(() => ({}));

const SmallerTitle = styled(StyledTitle)(() => ({
  fontSize: '1.25rem',
  margin: '1rem 0',
}));

const StyledTextField = styled(TextField)(() => ({}));

const StyledForm = styled('form')(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
}));

const ErrorMessage = styled('p')(({ theme }) => ({
  width: '100%',
  textAlign: 'center',
  color: theme.palette.error.main,
  fontSize: '1.15rem',
}));

const StyledSelect = styled('select')(() => ({
  padding: '1rem 8px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  fontFamily: 'inherit',
  fontSize: '1rem',
}));

const StyledOption = styled('option')(() => ({
  padding: '10px 5px',
}));

const StyledLabel = styled('label')(() => ({
  fontSize: '1rem',
}));

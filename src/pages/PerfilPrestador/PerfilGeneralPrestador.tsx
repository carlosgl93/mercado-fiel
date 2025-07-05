import { Prestador } from '@/types/Prestador';

type PerfilGeneralPrestadorProps = {
  prestador: Prestador;
};

export const PerfilGeneralPrestador = ({ prestador }: PerfilGeneralPrestadorProps) => {
  console.log('This prestador', prestador);
  return (
    <>
      <h1>Perfil General Prestador</h1>
    </>
  );
};

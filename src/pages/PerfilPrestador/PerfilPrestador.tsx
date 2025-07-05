import Meta from '@/components/Meta';
import { useNavigate, useParams } from 'react-router-dom';
import { MobileProfile } from './MobileProfile';

import Loading from '@/components/Loading';
import { Suspense, useEffect } from 'react';
import { usePrestador } from '@/hooks';

function PerfilPrestador() {
  const { id } = useParams();
  const { prestador, isLoading } = usePrestador(id ?? '');

  const navigate = useNavigate();

  useEffect(() => {
    if (!prestador && !isLoading) {
      navigate('/resultados');
      return;
    }
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  if (!prestador) {
    return null;
  }

  return (
    <Suspense fallback={<Loading />}>
      <Meta title="Perfil Prestador" />
      <MobileProfile prestador={prestador} />
    </Suspense>
  );
}

export default PerfilPrestador;

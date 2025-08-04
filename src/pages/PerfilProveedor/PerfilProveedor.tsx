import Meta from '@/components/Meta';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { MobileProfile } from './MobileProfile';

import Loading from '@/components/Loading';
import { Suspense, useEffect } from 'react';
import { SupplierWithProducts } from '../../models';

function PerfilProveedor() {
  const { id } = useParams();
  // const { prestador, isLoading } = usePrestador(id ?? '');
  const location = useLocation();
  console.log({ location });
  const { proveedor } = location.state;

  const navigate = useNavigate();

  useEffect(() => {
    if (!proveedor) {
      navigate('/resultados');
    }
  }, [proveedor, navigate]);

  return (
    <Suspense fallback={<Loading />}>
      <Meta title="Perfil Proveedor" />
      <MobileProfile proveedor={proveedor as SupplierWithProducts} />
    </Suspense>
  );
}

export default PerfilProveedor;

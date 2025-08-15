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
  const { supplier } = location.state;
  console.log({ location, supplier });

  const navigate = useNavigate();

  useEffect(() => {
    if (!supplier) {
      navigate('/resultados');
    }
  }, [supplier, navigate]);

  return (
    <Suspense fallback={<Loading />}>
      <Meta title="Perfil Proveedor" />
      <MobileProfile proveedor={supplier as SupplierWithProducts} />
    </Suspense>
  );
}

export default PerfilProveedor;

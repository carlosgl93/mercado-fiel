import Meta from '@/components/Meta';
import { useLocation, useNavigate } from 'react-router-dom';
import { DesktopProfile } from './DesktopProfile';
import { MobileProfile } from './MobileProfile';

import Loading from '@/components/Loading';
import { useMediaQuery, useTheme } from '@mui/material';
import { Suspense, useEffect } from 'react';
import { SupplierWithProducts } from '../../models';

function PerfilProveedor() {
  const location = useLocation();
  const { supplier } = location.state;
  console.log({ supplier });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const navigate = useNavigate();

  useEffect(() => {
    if (!supplier) {
      navigate('/resultados');
    }
  }, [supplier, navigate]);

  return (
    <Suspense fallback={<Loading />}>
      <Meta title="Perfil Proveedor" />

      {isMobile ? (
        <MobileProfile proveedor={supplier as SupplierWithProducts} />
      ) : (
        <DesktopProfile proveedor={supplier as SupplierWithProducts} />
      )}
    </Suspense>
  );
}

export default PerfilProveedor;

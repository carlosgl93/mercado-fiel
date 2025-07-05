import { Suspense } from 'react';
import Meta from '@/components/Meta';
import Loading from '@/components/Loading';
import MobileResults from './MobileResults';
import { useMediaQuery } from '@mui/material';
import DesktopResults from './DesktopResults';
import { mobile } from '../../theme/breakpoints';
import { ResultadosHeader } from './ResultadosHeader';
import { useGetPrestadores } from '@/hooks/useGetPrestadores';

function Resultados() {
  const { isLoading } = useGetPrestadores();
  const isMobile = useMediaQuery(mobile);

  return (
    <Suspense fallback={<Loading />}>
      <Meta title="Resultados" />

      <ResultadosHeader />

      {isLoading ? <Loading /> : isMobile ? <MobileResults /> : <DesktopResults />}
    </Suspense>
  );
}

export default Resultados;

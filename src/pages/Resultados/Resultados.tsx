import Meta from '@/components/Meta';
import { useMediaQuery } from '@mui/material';
import { mobile } from '../../theme/breakpoints';
import DesktopResults from './DesktopResults';
import MobileResults from './MobileResults';
import { ResultadosHeader } from './ResultadosHeader';

function Resultados() {
  const isMobile = useMediaQuery(mobile);

  return (
    <>
      <Meta title="Resultados" />
      <ResultadosHeader />
      {isMobile ? <MobileResults /> : <DesktopResults />}
    </>
  );
}

export default Resultados;

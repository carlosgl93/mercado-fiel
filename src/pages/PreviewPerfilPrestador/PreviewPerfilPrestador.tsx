import '../PerfilPrestador/mobileProfile.css';
import Meta from '@/components/Meta';
import { PreviewMobileProfile } from './PreviewMobileProfile';
import { useAuthNew, usePrestador } from '@/hooks';
import Loading from '@/components/Loading';

function PreviewPerfilPrestador() {
  const { prestador: loggedPrestador } = useAuthNew();
  const { prestador, isLoading } = usePrestador(loggedPrestador?.id ?? '');

  return (
    <>
      <Meta title="Preview Perfil Prestador" />

      {isLoading ? <Loading /> : <PreviewMobileProfile fullProvider={prestador} />}
    </>
  );
}

export default PreviewPerfilPrestador;

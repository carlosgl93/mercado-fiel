import Loading from '@/components/Loading';
import Meta from '@/components/Meta';
import { useAuth, usePrestador } from '@/hooks';
import '../PerfilPrestador/mobileProfile.css';
import { PreviewMobileProfile } from './PreviewMobileProfile';

function PreviewPerfilPrestador() {
  const { proveedor: loggedProveedor } = useAuth();
  const { prestador, isLoading } = usePrestador(loggedProveedor?.id ?? '');

  return (
    <>
      <Meta title="Preview Perfil Prestador" />

      {isLoading ? <Loading /> : <PreviewMobileProfile fullProvider={prestador} />}
    </>
  );
}

export default PreviewPerfilPrestador;

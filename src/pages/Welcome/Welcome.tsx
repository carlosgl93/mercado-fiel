import CommunityAdvantages from '@/components/CommunityAdvantages';
import ComoFunciona from '@/components/ComoFunciona';
import ImageSlider from '@/components/ImageSlider';
import Meta from '@/components/Meta';
import Servicios from '@/components/Servicios';
import { comoFuncionaCardsContent } from './comoFuncionaContent';

function Welcome() {
  return (
    <>
      <Meta title="Mercado Fiel: Inicio" />
      <ImageSlider />
      <ComoFunciona
        subtitle={`
        Mercado Fiel busca permitirle a minoristas poder comprar colaborativamente con otros minoristas y a proveedores acceder a más clientes en menos tiempo.
        `}
        steps={comoFuncionaCardsContent}
      />
      <Servicios />
      <CommunityAdvantages />
      {/* <CommunitySupport /> */}
    </>
  );
}

export default Welcome;

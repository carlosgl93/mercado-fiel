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
        Mercado Fiel es una plataforma que te permitirá encontrar proveedores de confianza y productos de calidad para todas tus necesidades. En Mercado Fiel encontrarás:
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

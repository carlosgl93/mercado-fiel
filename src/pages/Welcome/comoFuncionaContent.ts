export type ComoFuncionaContent = {
  mdImage: string;
  smImage: string;
  imgAlt: string;
  title: string;
  text: string;
};

export const comoFuncionaCardsContent: ComoFuncionaContent[] = [
  {
    smImage: `/images/como-funciona-sm.jpg`,
    mdImage: `/images/comofunciona-md-lg.jpg`,
    imgAlt: 'Mercado Fiel clientes o proveedores',
    title: 'Encuentra clientes o proveedores',
    text: 'Descubre nuevos proveedores o clientes en pocos segundos. Haz búsquedas según tus preferencias para lograr acuerdos más rápido y con las mejores condiciones',
  },
  {
    mdImage: `/images/secure-payment-md-lg.jpg`,
    smImage: `/images/secure-payment-sm.jpg`,
    imgAlt: 'Compra segura',
    title: 'Transacción segura',
    text: 'Cotiza, coordina y paga todo desde un solo lugar. Tus transacciones están protegidas con estándares de seguridad de nivel bancario gracias a Webpay y nuestra integración directa.',
  },
  {
    mdImage: `/images/win-win-md-lg.jpg`,
    smImage: `/images/win-win-sm.jpg`,
    imgAlt: 'Comunidad colaborativa',
    title: 'Todos ganan',
    text: 'Mientras tú ahorras comprando en grupo, los proveedores venden más y mejor. Una comunidad donde todos ganan.',
  },
];

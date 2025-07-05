import isMobile from '@/utils/is-mobile';
import type { Notifications } from './types';
const title = 'Mercado Fiel';
// TODO change this email
const email = 'contacto@mercadofiel.cl';
// TODO change the repository
const repository = 'https://github.com/TODO';

const customerSupportPhone = '+569 8974 2613';

const messages = {
  app: {
    crash: {
      title: 'Oops... Algo salio mal, puedes:',
      options: {
        email: `contactar a soporte al mail: ${email}`,
        reset: 'Presionar aqui para recargar la aplicacion',
      },
    },
  },
  loader: {
    fail: 'Hmm, Algo anda mal, intentalo nuevamente',
  },
  images: {
    failed: 'No se pudo cargar la imagen',
  },
  404: 'Esta pagina no existe.',
};

const dateFormat = 'DD MMMM, YYYY';

const notifications: Notifications = {
  options: {
    anchorOrigin: {
      vertical: 'bottom',
      horizontal: 'left',
    },
    autoHideDuration: 6000,
  },
  maxSnack: isMobile ? 3 : 4,
};

const loader = {
  // no more blinking in your app
  delay: 300, // if your asynchronous process is finished during 300 milliseconds you will not see the loader at all
  minimumLoading: 500, // but if it appears, it will stay for at least 700 milliseconds
};

const defaultMetaTags = {
  image: '/cover.png',
  description: 'Mercado Fiel: Marketplace de productos y servicios de confianza.',
};
const giphy404 = 'https://giphy.com/embed/2asOjumchIeb5gZO9m';

const paymentSettings = {
  appCommission: 1.02,
  currency: 'CLP',
  paymentMethods: 1,
  providerPayAfterDays: 3,
};

export {
  customerSupportPhone,
  dateFormat,
  defaultMetaTags,
  email,
  giphy404,
  loader,
  messages,
  notifications,
  paymentSettings,
  repository,
  title,
};

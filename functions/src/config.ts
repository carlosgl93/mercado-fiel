export const CACHE_EXPIRATION_TIME = 60 * 24000000; // 24 hours

export const sendEmailUrl = process.env.SEND_EMAIL_URL;

export const defaultEmailSender = 'Mercado Fiel <contacto@mercadofiel.cl>';

export const paymentSettings = {
  appCommission: 0.02,
  currency: 'CLP',
  paymentMethods: 1,
  providerPayAfterDays: 3,
};

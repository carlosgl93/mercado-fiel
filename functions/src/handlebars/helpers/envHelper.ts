export const envHelper = (redirectPath: string) => {
  const baseUrl = process.env.ENV === 'dev' ? process.env.DEV_URL : process.env.PROD_URL;
  return `${baseUrl}/${redirectPath}`;
};

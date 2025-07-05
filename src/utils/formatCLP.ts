export const formatCLP = (value: number | string | undefined) => {
  if (value === undefined) return '0';
  const valueToNumber = Number(value);
  const formatedNumber = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
  }).format(valueToNumber);
  return formatedNumber;
};

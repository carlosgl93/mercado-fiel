import { useCustomer, useCustomerAndPrestadorFromParams, usePrestador } from './index';

export const useRetrieveCustomerAndPrestador = () => {
  const { customerId, prestadorId } = useCustomerAndPrestadorFromParams();

  const {
    customer,
    isLoading: isLoadingCustomer,
    isError: isErrorCustomer,
  } = useCustomer(customerId);

  const {
    prestador,
    isLoading: isLoadingPrestador,
    isError: isErrorPrestador,
  } = usePrestador(prestadorId);

  const error = isErrorCustomer || isErrorPrestador;
  const isLoading = isLoadingCustomer || isLoadingPrestador;

  return {
    customer,
    prestador,
    isLoading,
    error,
  };
};

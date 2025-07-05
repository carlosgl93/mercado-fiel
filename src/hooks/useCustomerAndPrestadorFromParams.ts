import { useLocation } from 'react-router-dom';

export const useCustomerAndPrestadorFromParams = () => {
  const location = useLocation();
  const params = new URLSearchParams(location?.search);

  const customerId = location.state?.userId || params.get('userId');
  const prestadorId = location.state?.prestadorId || params.get('prestadorId');

  return {
    customerId,
    prestadorId,
  };
};

import { SuppliersListResponse } from '@/types/supplier';
import { Box } from '@mui/material';
import { UserLookingFor, useUserLookingFor } from '../../hooks';
import { Customer } from '../../models/Customer';
import { DesktopResultsListCustomer, DesktopResultsListSupplier } from './components';

const DesktopResultList = ({
  results,
  setPage,
  setLimit,
}: {
  results: Customer[] | SuppliersListResponse | undefined;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setLimit: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const { userLookingFor } = useUserLookingFor();

  if (
    !results ||
    (Array.isArray(results) && results.length === 0) ||
    (!Array.isArray(results) && !results.data?.length)
  ) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '60vh',
          px: '2rem',
        }}
      >
        No hay resultados para mostrar con estos filtros.
      </Box>
    );
  }

  // This should not happen now since parent components handle smart logic
  if (userLookingFor === null) {
    return null;
  }

  if (userLookingFor === UserLookingFor.CUSTOMERS) {
    return (
      <DesktopResultsListCustomer
        customers={results as Customer[]}
        setPage={setPage}
        setLimit={setLimit}
      />
    );
  } else if (userLookingFor === UserLookingFor.SUPPLIERS) {
    const suppliersData = (results as SuppliersListResponse).data || [];
    return (
      <DesktopResultsListSupplier suppliers={suppliersData} setPage={setPage} setLimit={setLimit} />
    );
  }
};

export default DesktopResultList;

import { Box, useTheme } from '@mui/material';
import { useState } from 'react';
import Loading from '../../components/Loading';
import { useCustomers, UserLookingFor, useUserLookingFor } from '../../hooks';
import { useSuppliers } from '../../hooks/useSuppliers';
import DesktopFilters from './DesktopFilters';
import DesktopResultList from './DesktopResultList';

const DesktopResults = () => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const { lookingFor, userLookingFor } = useUserLookingFor();

  const { isLoadingSuppliers, suppliers } = useSuppliers(page, limit);
  const { isLoadingCustomers, customers } = useCustomers(page, limit);

  const isLoading = isLoadingCustomers || isLoadingSuppliers;

  return (
    <Box
      sx={{
        display: 'grid',
        minHeight: '100vh',
        gridTemplateColumns: '25% 75%',
        backgroundColor: theme.palette.background.paper,
        gap: theme.spacing(16),
        m: '2.5vh 1vw',
        borderRadius: '0.5rem',
        padding: '1rem',
      }}
    >
      <DesktopFilters />
      {isLoading ? (
        <Loading />
      ) : (
        <DesktopResultList
          results={
            lookingFor === null
              ? [suppliers, customers]
              : userLookingFor === UserLookingFor.CUSTOMERS
              ? customers
              : suppliers
          }
          setPage={setPage}
          setLimit={setLimit}
        />
      )}
    </Box>
  );
};

export default DesktopResults;

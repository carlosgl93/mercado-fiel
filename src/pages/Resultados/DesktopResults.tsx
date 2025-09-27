import { Box, useTheme } from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../../components/Loading';
import { useAuth } from '../../hooks/useAuthSupabase';
import { useCustomers, UserLookingFor, useUserLookingFor } from '../../hooks';
import { useSuppliers } from '../../hooks/useSuppliers';
import DesktopFilters from './DesktopFilters';
import DesktopResultList from './DesktopResultList';

const DesktopResults = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const { user, supplier, customer, isAuthenticated } = useAuth();
  const { lookingFor, userLookingFor, handleSelectLookingFor } = useUserLookingFor();

  // Smart logic: redirect non-logged users and infer looking preference
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/comienzo', { replace: true });
      return;
    }

    // Auto-infer what user is looking for if not set
    if (userLookingFor === null) {
      if (supplier?.idProveedor) {
        handleSelectLookingFor(UserLookingFor.CUSTOMERS);
      } else if (customer?.idCliente || user?.data?.cliente) {
        handleSelectLookingFor(UserLookingFor.SUPPLIERS);
      }
    }
  }, [isAuthenticated, supplier, customer, user, userLookingFor, handleSelectLookingFor, navigate]);

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

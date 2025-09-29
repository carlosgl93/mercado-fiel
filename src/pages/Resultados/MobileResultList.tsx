import { Box, List, useTheme } from '@mui/material';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserLookingFor, useUserLookingFor } from '../../hooks';
import { useAuth } from '../../hooks/useAuthSupabase';
import { Customer } from '../../models/Customer';
import { SuppliersListResponse } from '../../types/supplier';
import { MobileResultsListCustomer, MobileResultsListSupplier } from './components';

export const MobileResultList = ({
  results,
  setPage,
  setLimit,
}: {
  results: Customer[] | SuppliersListResponse | undefined;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setLimit: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, supplier, customer, isAuthenticated } = useAuth();
  const { userLookingFor, handleSelectLookingFor } = useUserLookingFor();

  // Smart logic: infer what user is looking for based on their role
  useEffect(() => {
    if (!isAuthenticated()) {
      // Redirect non-logged users to /comienzo
      navigate('/comienzo', { replace: true });
      return;
    }

    // If userLookingFor is not set, infer from user role
    if (userLookingFor === null) {
      if (supplier?.idProveedor) {
        // Supplier/Proveedor looks for customers/clientes
        handleSelectLookingFor(UserLookingFor.CUSTOMERS);
      } else if (customer?.idCliente || user?.data?.cliente) {
        // Customer/Cliente looks for suppliers/proveedores
        handleSelectLookingFor(UserLookingFor.SUPPLIERS);
      }
    }
  }, [isAuthenticated, supplier, customer, user, userLookingFor, handleSelectLookingFor, navigate]);

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

  // This should not happen now since we auto-infer or redirect
  if (userLookingFor === null) {
    return null;
  }

  if (userLookingFor === UserLookingFor.CUSTOMERS) {
    return (
      <List
        component={'ul'}
        sx={{
          minHeight: '90vh',
          m: 0,
          p: 0,
        }}
      >
        <MobileResultsListCustomer
          customers={results as Customer[]}
          setPage={setPage}
          setLimit={setLimit}
        />
      </List>
    );
  } else if (userLookingFor === UserLookingFor.SUPPLIERS) {
    const suppliersData = (results as SuppliersListResponse).data || [];
    return (
      <List
        component={'ul'}
        sx={{
          minHeight: '90vh',
          m: 0,
          p: 0,
        }}
      >
        <MobileResultsListSupplier
          suppliers={suppliersData}
          setPage={setPage}
          setLimit={setLimit}
        />
      </List>
    );
  }
};

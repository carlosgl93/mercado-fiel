import Loading from '@/components/Loading';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import { Box, Button, Drawer, useTheme } from '@mui/material';
import { Suspense, useState } from 'react';
import { useCustomers, UserLookingFor, useUserLookingFor } from '../../hooks';
import { useSuppliers } from '../../hooks/useSuppliers';
import { MobileFilters } from './MobileFilters';
import { MobileResultList } from './MobileResultList';

const MobileResults = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const { lookingFor, userLookingFor } = useUserLookingFor();

  const { isLoadingSuppliers, suppliers } = useSuppliers(page, limit);
  const { isLoadingCustomers, customers } = useCustomers(page, limit);

  const isLoading = isLoadingCustomers || isLoadingSuppliers;

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  if (isLoadingSuppliers || isLoadingCustomers) {
    return <Loading />;
  }

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Button
          fullWidth
          variant="outlined"
          onClick={toggleDrawer}
          sx={{
            borderRadius: '0.5rem',
            p: '0 1rem',
            borderColor: '#99979c',
            maxWidth: '95vw',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              height: '100%',
              p: '0.5 1rem',
            }}
          >
            <p>Filtros</p>
            <TuneOutlinedIcon />
          </Box>
        </Button>
      </Box>

      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: theme.palette.background.paper,
          m: '5vh 1vw',
          borderRadius: '0.5rem',
        }}
      >
        <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
          <MobileFilters closeFilters={toggleDrawer} />
        </Drawer>

        <Suspense fallback={<Loading />}>
          <MobileResultList
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
        </Suspense>
      </Box>
    </>
  );
};

export default MobileResults;

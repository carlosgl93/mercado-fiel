import Loading from '@/components/Loading';
import { Text } from '@/components/StyledComponents';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import { Box, Button, Drawer, useTheme } from '@mui/material';
import { Suspense, useState } from 'react';
import { useCustomers } from '../../hooks';
import { useSuppliers } from '../../hooks/useSuppliers';
import { MobileFilters } from './MobileFilters';
import { MobileResultList } from './MobileResultList';

const MobileResults = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const theme = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { isLoadingSuppliers, suppliers } = useSuppliers(page, limit);
  const { customers } = useCustomers(page, limit);

  console.log('suppliers', suppliers);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  // const resultsLength = verifiedPrestadores?.prestadores?.length;

  if (isLoadingSuppliers) {
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
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          p: '1rem',
        }}
      >
        <Text>
          {/* {resultsLength && resultsLength > 0
            ? `${resultsLength} ${
                resultsLength === 1 ? 'prestador encontrado' : 'prestadores encontrados'
              }`
            : 'Ningun prestador encontrado para esta combinación de filtros.'} */}
        </Text>
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
            customers={customers}
            suppliers={suppliers}
            page={page}
            setPage={setPage}
            setLimit={setLimit}
          />
        </Suspense>
      </Box>
    </>
  );
};

export default MobileResults;

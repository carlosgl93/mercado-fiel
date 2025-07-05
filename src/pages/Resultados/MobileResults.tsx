import { Suspense, useState } from 'react';
import Loading from '@/components/Loading';
import { MobileFilters } from './MobileFilters';
import { Text } from '@/components/StyledComponents';
import { MobileResultList } from './MobileResultList';
import { useGetPrestadores } from '@/hooks/useGetPrestadores';
import { Box, Drawer, useTheme, Button } from '@mui/material';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';

const MobileResults = () => {
  const theme = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { verifiedPrestadores } = useGetPrestadores();

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const resultsLength = verifiedPrestadores?.prestadores?.length;

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
          {resultsLength && resultsLength > 0
            ? `${resultsLength} ${
                resultsLength === 1 ? 'prestador encontrado' : 'prestadores encontrados'
              }`
            : 'Ningun prestador encontrado para esta combinación de filtros.'}
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
          <MobileResultList />
        </Suspense>
      </Box>
    </>
  );
};

export default MobileResults;

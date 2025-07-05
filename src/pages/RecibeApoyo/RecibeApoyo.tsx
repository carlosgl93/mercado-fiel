import { Suspense, lazy } from 'react';
import { Box, LinearProgress } from '@mui/material';
const Step1 = lazy(() => import('./Step1'));
const Step2 = lazy(() => import('./Step2'));
const Step3 = lazy(() => import('./Step3'));
const Step4 = lazy(() => import('./Step4'));

import Meta from '@/components/Meta';
import { FullSizeCenteredFlexBox } from '@/components/styled';
import { recibeApoyoSteps } from './recibeApoyoSteps';
import useRecibeApoyo from '@/store/recibeApoyo';
import Loading from '@/components/Loading';

function Comienzo() {
  const [{ step }] = useRecibeApoyo();

  return (
    <>
      <Meta title="Encuentra lo que necesitas en Mercado Fiel" />
      <FullSizeCenteredFlexBox
        sx={{
          flexDirection: 'column',
          justifyContent: 'start',
          gap: 2,
          pt: 0,
        }}
      >
        <Box
          sx={{
            width: {
              xs: '100%',
            },
          }}
        >
          <LinearProgress
            variant="determinate"
            value={((step + 1) / recibeApoyoSteps.length) * 100}
          />
        </Box>
        <Suspense fallback={<Loading />}>
          {step === 0 && <Step1 />}
          {step === 1 && <Step2 />}
          {step === 2 && <Step3 />}
          {step === 3 && <Step4 />}
        </Suspense>
      </FullSizeCenteredFlexBox>
    </>
  );
}

export default Comienzo;

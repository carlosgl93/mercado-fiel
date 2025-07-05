import Loading from '@/components/Loading';
import Meta from '@/components/Meta';
import { FullSizeCenteredFlexBox } from '@/components/styled';
import useEntregaApoyo from '@/store/entregaApoyo';
import { Box, LinearProgress } from '@mui/material';
import { Suspense, lazy } from 'react';
import { entregaApoyoSteps } from './entregaApoyoSteps';
const Step1 = lazy(() => import('./Step1'));
const Step2 = lazy(() => import('./Step2'));
const Step3 = lazy(() => import('./Step3'));

function EntregaApoyo() {
  const [{ step }] = useEntregaApoyo();

  return (
    <>
      <Meta title="Empieza a ofrecer tu apoyo en Mercado Fiel" />
      <FullSizeCenteredFlexBox
        sx={{
          flexDirection: 'column',
          justifyContent: 'start',
          gap: 2,
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
            value={((step + 1) / entregaApoyoSteps.length) * 100}
          />
        </Box>
        <Suspense fallback={<Loading />}>
          {step === 0 && <Step1 />}
          {step === 1 && <Step2 />}
          {step === 2 && <Step3 />}
        </Suspense>
      </FullSizeCenteredFlexBox>
    </>
  );
}

export default EntregaApoyo;

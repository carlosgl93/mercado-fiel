import { useEffect } from 'react';

import Meta from '@/components/Meta';
import { FullSizeCenteredFlexBox } from '@/components/styled';
import { Text, TextContainer, Title } from '@/components/StyledComponents';
import useEntregaApoyo from '@/store/entregaApoyo';
import useRecibeApoyo from '@/store/recibeApoyo';
import { UserSearchesForCTAs } from '../../components';

function Comienzo() {
  const [, { resetRecibeApoyoState }] = useRecibeApoyo();
  const [, { resetEntregaApoyoState }] = useEntregaApoyo();

  useEffect(() => {
    resetRecibeApoyoState();
    resetEntregaApoyoState();
  }, []);

  return (
    <>
      <Meta title="Mercado Fiel - Tu marketplace de confianza" />

      {/* Original welcome section for logged users */}
      <FullSizeCenteredFlexBox
        sx={{
          flexDirection: 'column',
          justifyContent: 'start',
          gap: 2,
          pt: 8,
          pb: 4,
          minHeight: '80vh',
        }}
      >
        <TextContainer
          sx={{
            maxWidth: 500,
            textAlign: 'center',
          }}
        >
          <Title
            variant="h4"
            sx={{
              fontSize: '1.8rem',
              mb: 2,
            }}
          >
            ¿Qué buscas?
          </Title>
          <Text
            sx={{
              textAlign: 'center',
              mb: 3,
            }}
          >
            Elige una opción para continuar
          </Text>
        </TextContainer>
        <UserSearchesForCTAs />
        {/* <StyledList items={comienzoOptions} /> */}
      </FullSizeCenteredFlexBox>
    </>
  );
}

export default Comienzo;

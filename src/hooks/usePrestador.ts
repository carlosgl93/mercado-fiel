import { db } from '@/firebase/firebase';
import { Prestador } from '@/store/auth/proveedor';
import { interactedProveedorState } from '@/store/resultados/interactedPrestador';
import { notificationState } from '@/store/snackbar';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { useQuery } from 'react-query';
import { useSetRecoilState } from 'recoil';

const getPrestadorByIdFirestore = async (id: string): Promise<Prestador> => {
  const providersRef = doc(db, 'providers', id);
  const res = await getDoc(providersRef);

  const prestador = res.data() as Prestador;

  const availabilityRef = collection(providersRef, 'availability');
  const servicesRef = collection(providersRef, 'services');
  const availabilitySnapshot = await getDocs(availabilityRef);
  const servicesSnapshot = await getDocs(servicesRef);
  const services = servicesSnapshot.docs.map((d) => d.data());
  prestador.createdServicios = services;
  return prestador;
};

export const usePrestador = (prestadorId: string) => {
  const setNotification = useSetRecoilState(notificationState);
  const setInteractedPrestador = useSetRecoilState(interactedProveedorState);

  const {
    data: prestador,
    isError,
    isLoading,
    error,
  } = useQuery(['prestador', prestadorId], () => getPrestadorByIdFirestore(prestadorId), {
    enabled: !!prestadorId,
    onError: (error) => {
      console.error(error);
      setNotification({
        open: true,
        message: 'Ocurrió un error al cargar el perfil del prestador',
        severity: 'error',
      });
    },
    onSuccess: (data) => {
      setInteractedPrestador(data);
    },
  });

  return {
    prestador,
    isError,
    isLoading,
    error,
  };
};

import { Comuna } from '@/types';
import regions from '../utils/regions.json';
import { useEffect, useMemo, useState } from 'react';
import { notificationState } from '@/store/snackbar';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { useAuthNew } from './useAuthNew';
import { db } from '@/firebase/firebase';
import { doc, collection, updateDoc, where, query, getDocs } from 'firebase/firestore';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { comunasState } from '@/store/construirPerfil/comunas';
import { Prestador, prestadorState } from '@/store/auth/prestador';

const updateProviderComunas = async ({
  providerId,
  comunas,
}: {
  providerId: string;
  comunas: Comuna[];
}) => {
  const providerRef = doc(db, 'providers', providerId);

  await updateDoc(providerRef, {
    comunas: comunas,
    'settings.comunas': true,
  });
};

const removePrestadorComuna = async ({
  providerId,
  comuna,
  comunas,
}: {
  providerId: string;
  comuna: Comuna;
  comunas: Comuna[];
}) => {
  const providerRef = doc(db, 'providers', providerId);

  await updateDoc(providerRef, {
    comunas: comunas.filter((c) => c.name !== comuna.name),
  });
};

const fetchProviderComunas = async (providerId: string | undefined) => {
  if (!providerId) return;
  const providerRef = collection(db, 'providers');
  const q = query(providerRef, where('id', '==', providerId));
  const querySnapshot = await getDocs(q);
  const doc = querySnapshot.docs[0];

  if (!doc.exists) {
    throw new Error('Provider does not exist');
  }

  return doc.data().comunas;
};

export const useComunas = () => {
  const [comunasSearched, setComunasSearched] = useState<string>('');
  const [matchedComunas, setMatchedComunas] = useState<Comuna[]>([]);
  const [selectedComunas, setSelectedComunas] = useRecoilState(comunasState);
  const [, setNotification] = useRecoilState(notificationState);
  const { prestador, user } = useAuthNew();
  const setPrestador = useSetRecoilState(prestadorState);
  const queryClient = useQueryClient();

  const allComunas = useMemo(() => {
    const comunas: Comuna[] = [];
    regions.regiones.forEach((r, i) => {
      const newComunas = r.comunas.map((c, j) => {
        return {
          id: Number(`${i}${j}`),
          name: c,
          region: r.region,
          country: 'Chile',
        };
      });
      comunas.push(...newComunas);
    });

    return comunas;
  }, [regions]);

  const resetComunas = () => {
    setSelectedComunas([]);
  };

  const handleChangeSearchComuna = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setComunasSearched(e.target.value);
    const match = allComunas.filter((comuna) => {
      if (comuna.name.toLowerCase().includes(e.target.value.toLowerCase())) {
        return comuna;
      }
    });
    if (match.length) {
      setMatchedComunas(match);
    }
  };

  const handleSelectComuna = (comuna: Comuna) => {
    if (selectedComunas.some((comunaState) => comunaState.id === comuna.id)) {
      setNotification({
        message: 'Ya seleccionaste esta comuna',
        severity: 'warning',
        open: true,
      });

      return;
    } else {
      setSelectedComunas((prev) => [...prev, comuna]);
      setComunasSearched('');
      setMatchedComunas([]);
    }
  };

  const handleUpdatePrestadorComunas = () => {
    if (selectedComunas.length === 0) {
      setNotification({
        message: 'Debes seleccionar al menos una comuna',
        severity: 'warning',
        open: true,
      });
      return;
    }

    updateComunas({
      providerId: prestador!.id,
      comunas: selectedComunas,
    });
  };

  const { mutate: updateComunas, isLoading: updateComunasisLoading } = useMutation(
    updateProviderComunas,
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries('providerComunas');
        setPrestador(
          (prev) =>
            ({
              ...prev,
              settings: {
                ...prev?.settings,
                comunas: true,
              },
            } as Prestador),
        );
        setSelectedComunas(selectedComunas);
        setNotification({
          message: 'Comunas actualizadas',
          severity: 'success',
          open: true,
        });
      },
      onError: (error) => {
        console.error(error);
      },
    },
  );

  const handleRemoveComuna = (comuna: Comuna) => {
    if (prestador?.email) {
      removeComuna({ providerId: prestador!.id, comuna, comunas: selectedComunas });
    }
    setSelectedComunas((prev) => prev.filter((comunaState) => comunaState.id !== comuna.id));
  };

  const { mutate: removeComuna, isLoading: removeComunaIsLoading } = useMutation(
    removePrestadorComuna,
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries('providerComunas');

        setNotification({
          message: 'Comuna eliminada',
          severity: 'success',
          open: true,
        });
      },
      onError: (error) => {
        console.error(error);
      },
    },
  );

  const { data: prestadorComunas, isLoading: fetchPrestadorComunasIsLoading } = useQuery(
    ['providerComunas', prestador?.id],
    () => fetchProviderComunas(prestador?.id),
    {
      enabled: !!prestador?.id,
      onSuccess(data) {
        setSelectedComunas([...data]);
      },
      onError(error) {
        console.error(error);
        setNotification({
          message: 'Error al cargar comunas',
          severity: 'error',
          open: true,
        });
      },
    },
  );

  const getComunasNamesById = (comunasIds: number[]) => {
    const comunasNames = allComunas.filter((comuna) => comunasIds.includes(comuna.id));
    return comunasNames.map((comuna) => comuna.name).join(', ');
  };

  useEffect(() => {
    if (prestadorComunas) {
      setSelectedComunas(prestadorComunas);
    }
    if (user?.comuna) {
      setSelectedComunas([user.comuna]);
    }
  }, []);

  return {
    allComunas,
    comunasSearched,
    matchedComunas,
    selectedComunas,
    updateComunasisLoading,
    removeComunaIsLoading,
    fetchPrestadorComunasIsLoading,
    prestadorComunas,
    getComunasNamesById,
    setComunasSearched,
    setMatchedComunas,
    handleChangeSearchComuna,
    handleSelectComuna,
    handleRemoveComuna,
    handleUpdatePrestadorComunas,
    resetComunas,
  };
};

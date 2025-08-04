import { db } from '@/firebase/firebase';
import { Prestador, proveedorState } from '@/store/auth/proveedor';
import { comunasState } from '@/store/construirPerfil/comunas';
import { notificationState } from '@/store/snackbar';
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { getAllComunas } from '../api/comunas';
import { Comuna } from '../models';
import { useAuth } from './useAuth';

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

// const removePrestadorComuna = async ({
//   providerId,
//   comuna,
//   comunas,
// }: {
//   providerId: string;
//   comuna: Comuna;
//   comunas: Comuna[];
// }) => {
//   const providerRef = doc(db, 'providers', providerId);

//   await updateDoc(providerRef, {
//     comunas: comunas.filter((c) => c.name !== comuna.name),
//   });
// };

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
  const { proveedor, user } = useAuth();
  const setPrestador = useSetRecoilState(proveedorState);
  const queryClient = useQueryClient();

  const { data: allComunas, isLoading: isLoadingAllComunas } = useQuery<Comuna[]>(
    ['comunas'],
    () => {
      return getAllComunas();
    },
    {
      keepPreviousData: true,
      staleTime: 60 * 1000000000000,
    },
  );

  const resetComunas = () => {
    setSelectedComunas([]);
  };

  const handleChangeSearchComuna = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setComunasSearched(e.target.value);
    console.log('all comunas', allComunas);
    const match = (allComunas || []).filter((comuna: Comuna) => {
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

  // const handleUpdatePrestadorComunas = () => {
  //   if (selectedComunas.length === 0) {
  //     setNotification({
  //       message: 'Debes seleccionar al menos una comuna',
  //       severity: 'warning',
  //       open: true,
  //     });
  //     return;
  //   }

  //   updateComunas({
  //     providerId: proveedor!.idProveedor,
  //     comunas: selectedComunas,
  //   });
  // };

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

  // const handleRemoveComuna = (comuna: Comuna) => {
  //   if (proveedor?.email) {
  //     removeComuna({ providerId: proveedor!.id, comuna, comunas: selectedComunas });
  //   }
  //   setSelectedComunas((prev) => prev.filter((comunaState) => comunaState.id !== comuna.id));
  // };

  // const { mutate: removeComuna, isLoading: removeComunaIsLoading } = useMutation(
  //   removePrestadorComuna,
  //   {
  //     onSuccess: async () => {
  //       await queryClient.invalidateQueries('providerComunas');

  //       setNotification({
  //         message: 'Comuna eliminada',
  //         severity: 'success',
  //         open: true,
  //       });
  //     },
  //     onError: (error) => {
  //       console.error(error);
  //     },
  //   },
  // );

  const { data: prestadorComunas, isLoading: fetchPrestadorComunasIsLoading } = useQuery(
    ['providerComunas', proveedor?.id],
    () => fetchProviderComunas(proveedor?.id),
    {
      enabled: !!proveedor?.id,
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
    const comunasNames = (allComunas || []).filter((comuna: Comuna) =>
      comunasIds.includes(comuna.id),
    );
    return comunasNames.map((comuna: Comuna) => comuna.name).join(', ');
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
    // removeComunaIsLoading,
    fetchPrestadorComunasIsLoading,
    prestadorComunas,
    isLoadingAllComunas,
    getComunasNamesById,
    setComunasSearched,
    setMatchedComunas,
    handleChangeSearchComuna,
    handleSelectComuna,
    // handleRemoveComuna,
    // handleUpdatePrestadorComunas,
    resetComunas,
  };
};

import { prestadorState } from '@/store/auth/prestador';
import { tarifasState } from '@/store/construirPerfil/tarifas';
import { notificationState } from '@/store/snackbar';
import { TarifaFront } from '@/types';
import { db } from '@/firebase/firebase';
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';

const updateTarifas = async ({
  prestadorId,
  newTarifas,
  meetAndGreet,
}: {
  prestadorId: string;
  newTarifas: TarifaFront[];
  meetAndGreet: boolean;
}) => {
  const docRef = doc(db, 'providers', prestadorId);
  await updateDoc(docRef, {
    tarifas: newTarifas,
    offersFreeMeetAndGreet: meetAndGreet,
    'settings.tarifas': true,
  });
};

const fetchTarifas = async (prestadorId: string | undefined) => {
  if (!prestadorId) return;
  const providerRef = collection(db, 'providers');
  const q = query(providerRef, where('id', '==', prestadorId));
  const querySnapshot = await getDocs(q);
  const doc = querySnapshot.docs[0];

  if (!doc.exists) {
    throw new Error('Provider does not exist');
  }

  return doc.data().tarifas;
};

export const TarifaController = () => {
  const [newTarifas, setNewTarifas] = useRecoilState(tarifasState);
  const [prestador, setPrestadorState] = useRecoilState(prestadorState);
  const [, setNotification] = useRecoilState(notificationState);
  const navigate = useNavigate();
  const client = useQueryClient();

  const handleChangeTarifa = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    tarifa: TarifaFront,
  ) => {
    const { value } = e.target;
    return setNewTarifas((prev) => {
      return prev.map((t) => {
        if (t.id === tarifa.id) {
          return {
            ...t,
            price: value,
          };
        }
        return t;
      });
    });
  };

  const handleChangeFreeMeetGreet = () => {
    setPrestadorState((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        offersFreeMeetAndGreet: !prev.offersFreeMeetAndGreet,
      };
    });
  };

  const handleSaveTarifas = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prestador) {
      return navigate('/ingresar');
    }

    const prestadorId = prestador.id;
    saveTarifas({
      prestadorId,
      newTarifas,
      meetAndGreet: prestador.offersFreeMeetAndGreet ?? false,
    });
  };

  const { mutate: saveTarifas, isLoading: isSavingTarifas } = useMutation(updateTarifas, {
    onSuccess: () => {
      // invalidate tarifas query
      client.invalidateQueries('prestador');
      // update prestador.tarifas state
      setPrestadorState((prev) => {
        if (!prev) return null;
        // if (prev.tarifas.filter((t) => t.price === '').length > 0) return prev;
        return { ...prev, settings: { ...prev.settings, tarifas: true } };
      });

      setNotification({
        open: true,
        message: 'Tarifas guardadas exitosamente',
        severity: 'success',
      });
    },
    onError: (error) => {
      console.log(error);
      setNotification({
        open: true,
        message: 'Hubo un error actualizando las tarifas, intentalo nuevamente.',
        severity: 'error',
      });
    },
  });

  const { data: prestadorTarifas, isLoading: fetchPrestadorTarifasIsLoading } = useQuery(
    ['providerTarifas', prestador?.id],
    () => fetchTarifas(prestador?.id),
    {
      enabled: !!prestador?.id,
      onSuccess(data: TarifaFront[]) {
        setNewTarifas([...data]);
        if (data.filter((t) => t.price === '0').length > 0) return;
        setPrestadorState((prev) => {
          if (!prev) return null;
          return { ...prev, settings: { ...prev.settings, tarifas: true } };
        });
      },
      onError(error) {
        console.error(error);
        setNotification({
          message: 'Error al cargar Tarifas',
          severity: 'error',
          open: true,
        });
      },
    },
  );

  return {
    prestador,
    isSavingTarifas,
    prestadorTarifas,
    fetchPrestadorTarifasIsLoading,
    handleChangeTarifa,
    handleChangeFreeMeetGreet,
    handleSaveTarifas,
  };
};

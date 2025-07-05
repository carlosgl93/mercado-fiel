import { IDetallesBasicosInputs } from '@/pages/ConstruirPerfil/DetallesBasicos/DetallesBasicos';
import { db } from '@/firebase/firebase';
import { doc, updateDoc } from 'firebase/firestore';

type TUpdatePrestadorDocument = {
  prestador: IDetallesBasicosInputs;
  id: string;
};

export const updatePrestadorDetallesBasicos = async ({
  prestador,
  id,
}: TUpdatePrestadorDocument) => {
  const prestadorDoc = doc(db, 'providers', id);
  await updateDoc(prestadorDoc, { ...prestador, 'settings.detallesBasicos': true });
  return prestador;
};

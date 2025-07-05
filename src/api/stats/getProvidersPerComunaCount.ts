import { db } from '@/firebase';
import { collection, getDocs } from 'firebase/firestore';

type Prestador = {
  comunas: { name: string }[];
  servicio: 'Soporte Terapéutico' | 'Cuidadora' | 'Sana Compañía' | 'Servicios de enfermería';
};

export type ComunaCount = {
  total: number;
  'Soporte Terapéutico'?: number;
  Cuidadora?: number;
  'Sana Compañía'?: number;
  'Servicios de enfermería'?: number;
};

export const getProvidersPerComunaCount = async () => {
  const comunaCounts: Record<string, ComunaCount> = {};
  const providersRef = collection(db, 'providers');
  try {
    const querySnapshot = await getDocs(providersRef);
    querySnapshot.forEach((doc) => {
      const providerData: Prestador = doc.data() as Prestador;
      const comunas = providerData.comunas;

      if (Array.isArray(comunas)) {
        comunas.forEach((comuna: { name: string }) => {
          if (!comunaCounts[comuna.name]) {
            comunaCounts[comuna.name] = { total: 0 };
          }

          comunaCounts[comuna.name].total += 1;

          if (comunaCounts[comuna.name][providerData.servicio] === undefined) {
            comunaCounts[comuna.name][providerData.servicio] = 0;
          }

          comunaCounts[comuna.name][providerData.servicio]! += 1;
        });
      }
    });
    return Object.entries(comunaCounts).map(([name, count]) => ({ name, count }));
  } catch (error) {
    console.error('Error getting providers per comuna count:', error);
    throw new Error('Error getting providers per comuna count');
  }
};

import { TarifaBack, TarifaFront } from '@/types';
import { emptyTarifas } from '@/pages/ConstruirPerfil/Tarifas/emptyTarifa';
import api from '../api';

const formatTarifa = (tarifa: TarifaBack) => {
  return {
    id: tarifa.id,
    dayName: tarifa.day_name,
    price: tarifa.price,
  };
};

export const getPrestadorTarifas = async (id: string): Promise<TarifaFront[]> => {
  const response = await api.get(`/tarifas`, {
    params: {
      prestadorId: id,
    },
  });
  if (response.data.length === 0) {
    return emptyTarifas.map((tarifa) => formatTarifa(tarifa)) as TarifaFront[];
  }
  return response.data.map((tarifa: unknown) =>
    formatTarifa(tarifa as TarifaBack),
  ) as TarifaFront[];
};

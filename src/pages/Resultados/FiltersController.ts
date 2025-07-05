import { useServicios } from '@/hooks/useServicios';
import useRecibeApoyo from '@/store/recibeApoyo';
import { Servicio } from '@/types';
import { ChangeEvent } from 'react';

export const FiltersController = () => {
  const [{ servicio, especialidad, comuna }, { removeComuna, selectServicio, selectEspecialidad }] =
    useRecibeApoyo();

  const { allServicios } = useServicios();

  const especialidades = allServicios.find((s) => s.id === servicio?.id)?.especialidades;

  const handleSelectServicio = (e: ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === '') {
      selectServicio(null);
      selectEspecialidad(undefined);
      return;
    }
    const selectedService = allServicios.find((s: Servicio) => s.serviceName === e.target.value);
    selectEspecialidad(undefined);
    selectServicio(selectedService as Servicio);
  };

  return {
    servicio,
    especialidad,
    comuna,
    especialidades,
    allServicios,
    selectEspecialidad,
    removeComuna,
    handleSelectServicio,
  };
};

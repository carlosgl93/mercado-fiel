import useRecibeApoyo from '@/store/recibeApoyo';

export const FiltersController = () => {
  const [{ servicio, especialidad, comuna }, { removeComuna, selectServicio, selectEspecialidad }] =
    useRecibeApoyo();

  return {
    servicio,
    especialidad,
    comuna,
    selectEspecialidad,
    removeComuna,
  };
};

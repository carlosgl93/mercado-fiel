import useRecibeApoyo from '../store/recibeApoyo';
import { useCategories } from './useCategories';
import { useComunas } from './useComunas';
import { useUserLookingFor } from './useUserLookingFor';

export const useResultFilters = () => {
  const {
    allComunas,
    comunasSearched,
    handleChangeSearchComuna,
    handleSelectComuna,
    selectedComunas,
  } = useComunas();
  const { userLookingFor } = useUserLookingFor();
  const { getCategories, selectedCategory } = useCategories();
  const [{ comuna }] = useRecibeApoyo();

  return {
    allComunas,
    comuna,
    comunasSearched,
    selectedComunas,
    userLookingFor,
    selectedCategory,
    handleChangeSearchComuna,
    handleSelectComuna,
    getCategories,
  };
};

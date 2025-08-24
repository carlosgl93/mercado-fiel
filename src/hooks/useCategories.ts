import { useQuery } from 'react-query';
import { useRecoilState } from 'recoil';
import { categoriesApi } from '../api';
import { categoryState } from '../store/categories/categoriesStore';
import { Category as ApiCategory } from '../types/api/categories';

export type Category = {
  id: string;
  name: string;
};

export const useCategories = () => {
  const [selectedCategory, setSelectedCategory] = useRecoilState(categoryState);

  const { data: categoriesResponse, isLoading: isLoadingCategories } = useQuery('categories', () =>
    categoriesApi.getCategories(),
  );

  const categories: ApiCategory[] = categoriesResponse?.data || [];

  const handleSelectCategory = (categoryId: string) => {
    const category = categories.find(
      (cat: ApiCategory) => cat.idCategoria.toString() === categoryId,
    );
    if (category) {
      setSelectedCategory({ id: category.idCategoria.toString(), name: category.nombre });
    } else {
      setSelectedCategory({ id: '', name: '' });
    }
  };

  return {
    getCategories: categories,
    isLoadingCategories,
    selectedCategory,
    handleSelectCategory,
  };
};

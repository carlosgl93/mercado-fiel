import { useQuery } from 'react-query';
import { useRecoilState } from 'recoil';
import { getCategories } from '../api/categories';
import { categoryState } from '../store/categories/categoriesStore';

export type Category = {
  id: string;
  name: string;
};

export const useCategories = () => {
  const [selectedCategory, setSelectedCategory] = useRecoilState(categoryState);

  const { data: categories, isLoading: isLoadingCategories } = useQuery('categories', () =>
    getCategories(),
  );

  const handleSelectCategory = (categoryId: string) => {
    const category = categories.find((cat: Category) => cat.id === categoryId);
    if (category) {
      setSelectedCategory(category);
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

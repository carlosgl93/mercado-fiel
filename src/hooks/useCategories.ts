import { useRecoilState } from 'recoil';
import { categoryState } from '../store/categories/categoriesStore';

export type Category = {
  id: string;
  name: string;
};

const productCategories = [
  { id: '1', name: 'Frutas y Verduras' },
  { id: '2', name: 'Carnes y Pescados' },
  { id: '3', name: 'Panadería y Pastelería' },
  { id: '4', name: 'Lácteos y Quesos' },
  { id: '14', name: 'Bebidas y Jugos' },
  { id: '15', name: 'Alimentos Gourmet' },
  // { id: '2', name: 'Hogar y Decoración' },
  // { id: '3', name: 'Tecnología y Electrónica' },
  // { id: '4', name: 'Moda y Accesorios' },
  { id: '5', name: 'Salud y Belleza' },
  { id: '6', name: 'Deportes y Outdoor' },
  // { id: '7', name: 'Servicios Profesionales' },
  { id: '8', name: 'Mascotas' },
  // { id: '9', name: 'Ferretería y Construcción' },
  // { id: '10', name: 'Educación y Capacitación' },
  // { id: '11', name: 'Automóviles y Repuestos' },
  { id: '12', name: 'Arte y Cultura' },
  { id: '13', name: 'Juguetes y Niños' },
  // { id: '14', name: 'Servicios de Entrega' },
];

export const useCategories = () => {
  const [selectedCategory, setSelectedCategory] = useRecoilState(categoryState);

  const getCategories = () => {
    return productCategories;
  };

  const handleSelectCategory = (categoryId: string) => {
    const category = productCategories.find((cat) => cat.id === categoryId);
    if (category) {
      setSelectedCategory(category);
    } else {
      setSelectedCategory({ id: '', name: '' });
    }
  };

  return {
    getCategories,
    selectedCategory,
    handleSelectCategory,
  };
};

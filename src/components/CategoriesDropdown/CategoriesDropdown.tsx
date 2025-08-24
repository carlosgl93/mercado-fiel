import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useCategories } from '../../hooks/useCategories';
import { Category } from '../../types/api/categories';

type CategoriesDropdownProps = {
  onCategorySelect?: (categoryId: string) => void;
  label?: string;
  navigateOnChange?: boolean;
};

function CategoriesDropdown({
  onCategorySelect,
  label = 'Selecciona una categoría',
}: CategoriesDropdownProps) {
  const { getCategories, selectedCategory, handleSelectCategory } = useCategories();

  const categories = getCategories;

  const handleChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value as string;
    handleSelectCategory(value);

    if (onCategorySelect) {
      onCategorySelect(value);
    }
  };

  return (
    <FormControl
      fullWidth
      sx={{
        mt: '1rem',
        width: {
          xs: '100%',
          sm: '100%',
          md: '60vw',
          lg: '50vw',
        },
        backgroundColor: 'white',
        borderRadius: '2rem',
        boxShadow: 1,
      }}
    >
      <InputLabel
        id="category-select-label"
        sx={{
          pl: 2,
          fontWeight: 500,
          // transform: 'translateY(8px) scale(0.85)',
          '&.MuiInputLabel-shrink': {
            transform: 'translateY(2px) translateX(24px) scale(0.5)',
          },
        }}
      >
        {label}
      </InputLabel>
      <Select
        labelId="category-select-label"
        id="category-select"
        value={selectedCategory.id}
        label={label}
        onChange={handleChange}
        sx={{
          borderRadius: '2rem',
          backgroundColor: 'white',
          pl: 2,
          fontWeight: 500,
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              borderRadius: '1rem',
              boxShadow: 3,
              maxHeight: '200px',
            },
          },
        }}
      >
        {categories?.map((cat: Category) => (
          <MenuItem
            key={cat.idCategoria}
            value={cat.idCategoria.toString()}
            sx={{
              borderRadius: '1rem',
              mx: 1,
              my: 0.5,
              px: 2,
              py: 1,
              fontWeight: 400,
            }}
          >
            {cat.nombre}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default CategoriesDropdown;

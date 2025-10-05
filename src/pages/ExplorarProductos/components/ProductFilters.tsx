import { categoriesApi } from '@/api/categories';
import { Category } from '@/types/api/categories';
import { ProductFilters as ProductFiltersType } from '@/types/products';
import {
  Close as CloseIcon,
  FilterList as FilterListIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { useQuery } from 'react-query';

interface ProductFiltersComponentProps {
  filters: ProductFiltersType;
  onFiltersChange: (filters: ProductFiltersType) => void;
  onClose: () => void;
}

export const ProductFiltersComponent: React.FC<ProductFiltersComponentProps> = ({
  filters,
  onFiltersChange,
  onClose,
}) => {
  const [localFilters, setLocalFilters] = useState<ProductFiltersType>(filters);

  // Query for categories
  const { data: categoriesResponse } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getCategories(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const categories = categoriesResponse?.data || [];

  const handleApplyFilters = () => {
    // Always ensure disponible is true
    const filtersToApply = {
      ...localFilters,
      page: 1,
      disponible: true,
    };
    onFiltersChange(filtersToApply);
    onClose();
  };

  const handleResetFilters = () => {
    const resetFilters: ProductFiltersType = {
      disponible: true,
      page: 1,
      limit: 12,
      sortBy: 'created_at',
      sortOrder: 'desc',
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  const handleLocalFilterChange = (key: keyof ProductFiltersType, value: any) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: value === '' ? undefined : value,
    }));
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (localFilters.search) count++;
    if (localFilters.categoria) count++;
    if (localFilters.proveedor) count++;
    if (localFilters.elegibleCompraColectiva !== undefined) count++;
    return count;
  };

  return (
    <Box
      sx={{
        width: { xs: '100vw', sm: 350 },
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterListIcon color="primary" />
          <Typography variant="h6" component="h2">
            Filtros
          </Typography>
          {getActiveFiltersCount() > 0 && (
            <Chip label={getActiveFiltersCount()} color="primary" size="small" />
          )}
        </Box>
        <IconButton onClick={onClose} edge="end">
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Filters Content */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        {/* Category Filter */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
            Categoría
          </Typography>
          <FormControl fullWidth size="small">
            <InputLabel>Seleccionar categoría</InputLabel>
            <Select
              value={localFilters.categoria || ''}
              label="Seleccionar categoría"
              onChange={(e) => handleLocalFilterChange('categoria', e.target.value)}
            >
              <MenuItem value="">
                <em>Todas las categorías</em>
              </MenuItem>
              {categories?.map((category: Category) => (
                <MenuItem key={category.idCategoria} value={category.idCategoria.toString()}>
                  {category.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Collective Purchase Filter */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
            Tipo de compra
          </Typography>
          <FormControl fullWidth size="small">
            <InputLabel>Tipo de compra</InputLabel>
            <Select
              value={
                localFilters.elegibleCompraColectiva === undefined
                  ? ''
                  : localFilters.elegibleCompraColectiva
                  ? 'true'
                  : 'false'
              }
              label="Tipo de compra"
              onChange={(e) => {
                const value = e.target.value;
                handleLocalFilterChange(
                  'elegibleCompraColectiva',
                  value === '' ? undefined : value === 'true',
                );
              }}
            >
              <MenuItem value="">
                <em>Todos los productos</em>
              </MenuItem>
              <MenuItem value="true">Solo compras colectivas</MenuItem>
              <MenuItem value="false">Solo compras individuales</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Sort Options */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
            Ordenar por
          </Typography>
          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel>Campo</InputLabel>
            <Select
              value={localFilters.sortBy || 'created_at'}
              label="Campo"
              onChange={(e) => handleLocalFilterChange('sortBy', e.target.value)}
            >
              <MenuItem value="created_at">Fecha de publicación</MenuItem>
              <MenuItem value="precio_unitario">Precio</MenuItem>
              <MenuItem value="nombre_producto">Nombre</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth size="small">
            <InputLabel>Orden</InputLabel>
            <Select
              value={localFilters.sortOrder || 'desc'}
              label="Orden"
              onChange={(e) =>
                handleLocalFilterChange('sortOrder', e.target.value as 'asc' | 'desc')
              }
            >
              <MenuItem value="asc">Ascendente</MenuItem>
              <MenuItem value="desc">Descendente</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Items per page */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
            Productos por página
          </Typography>
          <FormControl fullWidth size="small">
            <InputLabel>Cantidad</InputLabel>
            <Select
              value={localFilters.limit || 12}
              label="Cantidad"
              onChange={(e) => handleLocalFilterChange('limit', Number(e.target.value))}
            >
              <MenuItem value={6}>6 productos</MenuItem>
              <MenuItem value={12}>12 productos</MenuItem>
              <MenuItem value={24}>24 productos</MenuItem>
              <MenuItem value={48}>48 productos</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Footer with action buttons */}
      <Box
        sx={{
          p: 2,
          borderTop: 1,
          borderColor: 'divider',
          display: 'flex',
          gap: 1,
        }}
      >
        <Button
          variant="outlined"
          onClick={handleResetFilters}
          startIcon={<RefreshIcon />}
          sx={{ flex: 1 }}
        >
          Resetear
        </Button>
        <Button variant="contained" onClick={handleApplyFilters} sx={{ flex: 2 }}>
          Aplicar Filtros
        </Button>
      </Box>
    </Box>
  );
};

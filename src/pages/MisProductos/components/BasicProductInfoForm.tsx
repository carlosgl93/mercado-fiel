import { CLPCurrencyInput } from '@/components/NumberInput';
import { Category } from '@/types/api/categories';
import { CreateProductRequest } from '@/types/products';
import {
    FormControl,
    FormControlLabel,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Switch,
    TextField,
    Typography,
} from '@mui/material';
import React from 'react';

interface BasicProductInfoFormProps {
  formData: CreateProductRequest;
  categories: Category[];
  errors: Record<string, string>;
  onInputChange: (field: keyof CreateProductRequest) => (event: React.ChangeEvent<HTMLInputElement | { value: unknown }>) => void;
  onSelectChange: (field: keyof CreateProductRequest) => (event: any) => void;
  onSwitchChange: (field: keyof CreateProductRequest) => (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPriceChange: (value: number | undefined) => void;
}

export const BasicProductInfoForm: React.FC<BasicProductInfoFormProps> = ({
  formData,
  categories,
  errors,
  onInputChange,
  onSelectChange,
  onSwitchChange,
  onPriceChange,
}) => {
  return (
    <>
      {/* Section Header */}
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Información Básica
        </Typography>
      </Grid>

      {/* Product Name */}
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Nombre del Producto"
          value={formData.nombreProducto}
          onChange={onInputChange('nombreProducto')}
          error={!!errors.nombreProducto}
          helperText={errors.nombreProducto}
          required
        />
      </Grid>

      {/* Category Selection */}
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth error={!!errors.idCategoria}>
          <InputLabel>Categoría *</InputLabel>
          <Select
            value={formData.idCategoria}
            onChange={onSelectChange('idCategoria')}
            label="Categoría *"
          >
            <MenuItem value={0}>Seleccionar categoría</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.idCategoria} value={category.idCategoria}>
                {category.nombre}
              </MenuItem>
            ))}
          </Select>
          {errors.idCategoria && (
            <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1 }}>
              {errors.idCategoria}
            </Typography>
          )}
        </FormControl>
      </Grid>

      {/* Unit Type Selection */}
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Tipo de Precio *</InputLabel>
          <Select
            value={formData.unitType || 'unit'}
            onChange={onSelectChange('unitType')}
            label="Tipo de Precio *"
          >
            <MenuItem value="unit">Precio por Unidad</MenuItem>
            <MenuItem value="kg">Precio por Kilogramo</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      {/* Price Input */}
      <Grid item xs={12} sm={6}>
        <CLPCurrencyInput
          fullWidth
          label={formData.unitType === 'kg' ? 'Precio por Kilogramo' : 'Precio por Unidad'}
          value={formData.precioUnitario}
          onChange={onPriceChange}
          error={!!errors.precioUnitario}
          helperText={errors.precioUnitario}
          required
          min={0}
        />
      </Grid>

      {/* Description */}
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Descripción"
          multiline
          rows={3}
          value={formData.descripcion}
          onChange={onInputChange('descripcion')}
        />
      </Grid>

      {/* Availability Switch */}
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Switch 
              checked={formData.disponible} 
              onChange={onSwitchChange('disponible')} 
            />
          }
          label="Producto disponible"
        />
      </Grid>
    </>
  );
};

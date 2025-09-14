import {
    Clear as ClearIcon,
    Close as CloseIcon,
} from '@mui/icons-material';
import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import React, { useState } from 'react';

export interface SearchFilters {
  searchTerm: string;
  category: string;
  region: string;
  comuna: string;
}

interface SearchFiltersModalProps {
  open: boolean;
  onClose: () => void;
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  searchType: number; // 0 = providers, 1 = clients
}

// Mock data - replace with real data from API
const CATEGORIES = [
  'Frutas y Verduras',
  'Productos Lácteos',
  'Carnes y Pescados',
  'Granos y Cereales',
  'Productos Artesanales',
  'Panadería',
  'Conservas',
  'Bebidas',
  'Hierbas y Especias',
  'Productos Orgánicos',
];

const REGIONS = [
  'Región Metropolitana',
  'Región de Valparaíso',
  'Región del Bio Bio',
  'Región de Los Lagos',
  'Región de La Araucanía',
  'Región de Antofagasta',
  'Región de Atacama',
  'Región de Coquimbo',
  'Región del Libertador General Bernardo O\'Higgins',
  'Región del Maule',
];

const COMUNAS_BY_REGION: { [key: string]: string[] } = {
  'Región Metropolitana': [
    'Santiago',
    'Las Condes',
    'Providencia',
    'Ñuñoa',
    'La Florida',
    'Maipú',
    'Puente Alto',
    'Peñalolén',
    'San Bernardo',
    'Quilicura',
  ],
  'Región de Valparaíso': [
    'Valparaíso',
    'Viña del Mar',
    'Quilpué',
    'Villa Alemana',
    'San Antonio',
    'Casablanca',
  ],
  // Add more comunas for other regions as needed
};

export const SearchFiltersModal: React.FC<SearchFiltersModalProps> = ({
  open,
  onClose,
  filters,
  onFiltersChange,
  searchType,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [tempFilters, setTempFilters] = useState<SearchFilters>(filters);

  const handleFilterChange = (field: keyof SearchFilters, value: string) => {
    setTempFilters(prev => ({
      ...prev,
      [field]: value,
      // Clear comuna when region changes
      ...(field === 'region' && { comuna: '' }),
    }));
  };

  const handleApplyFilters = () => {
    onFiltersChange(tempFilters);
    onClose();
  };

  const handleClearFilters = () => {
    const clearedFilters: SearchFilters = {
      searchTerm: tempFilters.searchTerm, // Keep search term
      category: '',
      region: '',
      comuna: '',
    };
    setTempFilters(clearedFilters);
  };

  const handleClose = () => {
    setTempFilters(filters); // Reset to original filters
    onClose();
  };

  const getActiveFiltersCount = () => {
    return Object.entries(tempFilters).filter(([key, value]) => 
      key !== 'searchTerm' && value !== ''
    ).length;
  };

  const availableComunas = tempFilters.region ? COMUNAS_BY_REGION[tempFilters.region] || [] : [];

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullScreen={fullScreen}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: fullScreen ? 0 : 2,
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight="600">
            Filtrar {searchType === 0 ? 'Proveedores' : 'Clientes'}
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Category Filter (only for suppliers) */}
          {searchType === 0 && (
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Categoría</InputLabel>
                <Select
                  value={tempFilters.category}
                  label="Categoría"
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                >
                  <MenuItem value="">
                    <em>Todas las categorías</em>
                  </MenuItem>
                  {CATEGORIES.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}

          {/* Region Filter */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Región</InputLabel>
              <Select
                value={tempFilters.region}
                label="Región"
                onChange={(e) => handleFilterChange('region', e.target.value)}
              >
                <MenuItem value="">
                  <em>Todas las regiones</em>
                </MenuItem>
                {REGIONS.map((region) => (
                  <MenuItem key={region} value={region}>
                    {region}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Comuna Filter */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth disabled={!tempFilters.region}>
              <InputLabel>Comuna</InputLabel>
              <Select
                value={tempFilters.comuna}
                label="Comuna"
                onChange={(e) => handleFilterChange('comuna', e.target.value)}
              >
                <MenuItem value="">
                  <em>Todas las comunas</em>
                </MenuItem>
                {availableComunas.map((comuna) => (
                  <MenuItem key={comuna} value={comuna}>
                    {comuna}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Active Filters Summary */}
        {getActiveFiltersCount() > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Filtros activos:
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {tempFilters.category && (
                <Chip
                  label={`Categoría: ${tempFilters.category}`}
                  onDelete={() => handleFilterChange('category', '')}
                  size="small"
                />
              )}
              {tempFilters.region && (
                <Chip
                  label={`Región: ${tempFilters.region}`}
                  onDelete={() => handleFilterChange('region', '')}
                  size="small"
                />
              )}
              {tempFilters.comuna && (
                <Chip
                  label={`Comuna: ${tempFilters.comuna}`}
                  onDelete={() => handleFilterChange('comuna', '')}
                  size="small"
                />
              )}
              <Button
                startIcon={<ClearIcon />}
                onClick={handleClearFilters}
                size="small"
                sx={{ ml: 1 }}
              >
                Limpiar todo
              </Button>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleClose} color="inherit">
          Cancelar
        </Button>
        <Button
          onClick={handleApplyFilters}
          variant="contained"
          sx={{ ml: 2 }}
        >
          Aplicar Filtros
          {getActiveFiltersCount() > 0 && ` (${getActiveFiltersCount()})`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

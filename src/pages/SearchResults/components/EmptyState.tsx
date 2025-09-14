import {
    People as PeopleIcon,
    SearchOff as SearchOffIcon,
    Store as StoreIcon,
} from '@mui/icons-material';
import {
    Box,
    Button,
    Paper,
    Typography,
} from '@mui/material';
import React from 'react';

interface EmptyStateProps {
  searchType: number; // 0 = providers, 1 = clients
  searchTerm?: string;
  onClearSearch?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  searchType,
  searchTerm,
  onClearSearch,
}) => {
  const isSuppliers = searchType === 0;
  const entityName = isSuppliers ? 'proveedores' : 'clientes';
  const EntityIcon = isSuppliers ? StoreIcon : PeopleIcon;

  return (
    <Paper sx={{ p: 8, textAlign: 'center' }}>
      <Box sx={{ mb: 3 }}>
        {searchTerm ? (
          <SearchOffIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        ) : (
          <EntityIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        )}
      </Box>
      
      <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
        {searchTerm 
          ? `No se encontraron ${entityName} que coincidan con "${searchTerm}"`
          : `No se encontraron ${entityName} que coincidan con la búsqueda.`
        }
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
        {searchTerm 
          ? `Intenta con otros términos de búsqueda o ajusta los filtros para encontrar ${entityName}.`
          : `Intenta ajustar los filtros o realizar una búsqueda más específica.`
        }
      </Typography>

      {searchTerm && onClearSearch && (
        <Button
          variant="outlined"
          onClick={onClearSearch}
          sx={{ mt: 1 }}
        >
          Limpiar búsqueda
        </Button>
      )}
    </Paper>
  );
};

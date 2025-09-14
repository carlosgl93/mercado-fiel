import { User } from '@/api/users';
import { Supplier } from '@/types/supplier';
import {
  FilterList as FilterListIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import {
  Alert,
  Badge,
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  InputAdornment,
  Paper,
  Tab,
  Tabs,
  TextField
} from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ClientCard,
  EmptyState,
  SearchFiltersModal,
  SupplierCard
} from './components';
import { useSearchLogic } from './hooks/useSearchLogic';

export const SearchResults: React.FC = () => {
  const navigate = useNavigate();
  const [showFiltersModal, setShowFiltersModal] = useState(false);

  // Use custom hook for search logic
  const {
    searchType,
    filters,
    suppliers,
    clients,
    isLoading,
    error,
    handleSearchTermChange,
    handleFiltersChange,
    handleTabChange,
  } = useSearchLogic();

  // Navigation handlers
  const handleSupplierClick = (supplierId: number) => {
    navigate(`/proveedor/${supplierId}`);
  };

  const handleClientClick = (clientId: number) => {
    navigate(`/cliente/${clientId}`);
  };

  const handleClearSearch = () => {
    handleSearchTermChange('');
  };

  const getActiveFiltersCount = () => {
    return Object.entries(filters).filter(([key, value]) => 
      key !== 'searchTerm' && value !== ''
    ).length;
  };

  const hasResults = searchType === 0 ? suppliers.length > 0 : clients.length > 0;

  return (
    <Box
      sx={{
        bgcolor: '#F6F6F4',
        minHeight: '100vh',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 4,
            bgcolor: 'white',
            borderRadius: 2,
          }}
        >
         

          {/* Search Bar */}
          <Box
            display="flex"
            flexDirection={{ xs: 'column', sm: 'row' }}
            gap={2}
            alignItems="stretch"
            sx={{ mb: 3 }}
          >
            <TextField
              fullWidth
              placeholder="Buscar proveedores, productos, servicios..."
              value={filters.searchTerm}
              onChange={(e) => handleSearchTermChange(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '50px',
                  bgcolor: 'white',
                },
              }}
            />
            <Badge badgeContent={getActiveFiltersCount()} color="primary">
              <Button
                variant="contained"
                startIcon={<FilterListIcon />}
                onClick={() => setShowFiltersModal(true)}
                sx={{
                  borderRadius: '50px',
                  px: 3,
                  whiteSpace: 'nowrap',
                  minWidth: 'auto',
                }}
              >
                Filtros
              </Button>
            </Badge>
          </Box>

          {/* Tabs */}
          <Tabs
            value={searchType}
            onChange={(_, newValue) => handleTabChange(newValue)}
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
              },
            }}
          >
            <Tab label="Proveedores" />
            <Tab label="Clientes" />
          </Tabs>
        </Paper>

        {/* Results */}
        <Box>
          {isLoading ? (
            <Box display="flex" justifyContent="center" py={8}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 3 }}>
              Error al cargar los resultados. Por favor intenta nuevamente.
            </Alert>
          ) : hasResults ? (
            <Grid container spacing={3}>
              {searchType === 0 ? (
                suppliers.map((supplier: Supplier) => (
                  <Grid item xs={12} key={supplier.idProveedor}>
                    <SupplierCard
                      supplier={supplier}
                      onSupplierClick={handleSupplierClick}
                    />
                  </Grid>
                ))
              ) : (
                clients.map((client: User) => (
                  <Grid item xs={12} key={client.idUsuario}>
                    <ClientCard
                      client={client}
                      onClientClick={handleClientClick}
                    />
                  </Grid>
                ))
              )}
            </Grid>
          ) : (
            <EmptyState
              searchType={searchType}
              searchTerm={filters.searchTerm}
              onClearSearch={handleClearSearch}
            />
          )}
        </Box>

        {/* Search Filters Modal */}
        <SearchFiltersModal
          open={showFiltersModal}
          onClose={() => setShowFiltersModal(false)}
          filters={filters}
          onFiltersChange={handleFiltersChange}
          searchType={searchType}
        />
      </Container>
    </Box>
  );
};

export default SearchResults;

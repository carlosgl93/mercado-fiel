import { Product } from '@/types/products';
import { Add as AddIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  Container,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import React, { useState } from 'react';
import { CreateProductModal, EditProductModal, ProductsList } from './components';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index, ...other }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`products-tabpanel-${index}`}
      aria-labelledby={`products-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export const MisProductos: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [currentTab, setCurrentTab] = useState(0);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleCreateProduct = () => {
    setCreateModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setEditModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setCreateModalOpen(false);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
        flexDirection={isMobile ? 'column' : 'row'}
        gap={2}
      >
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Mis Productos
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gestiona tu catálogo de productos y configuración de descuentos
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateProduct}
          size={isMobile ? 'medium' : 'large'}
          sx={{ minWidth: isMobile ? '100%' : 200 }}
        >
          Nuevo Producto
        </Button>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          aria-label="product management tabs"
          variant={isMobile ? 'fullWidth' : 'standard'}
        >
          <Tab label="Todos los Productos" id="products-tab-0" />
          <Tab label="Productos Activos" id="products-tab-1" />
          <Tab label="Productos Inactivos" id="products-tab-2" />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <TabPanel value={currentTab} index={0}>
        <ProductsList filters={{}} onEdit={handleEditProduct} />
      </TabPanel>

      <TabPanel value={currentTab} index={1}>
        <ProductsList filters={{ disponible: true }} onEdit={handleEditProduct} />
      </TabPanel>

      <TabPanel value={currentTab} index={2}>
        <ProductsList filters={{ disponible: false }} onEdit={handleEditProduct} />
      </TabPanel>

      {/* Modals */}
      <CreateProductModal open={createModalOpen} onClose={handleCloseCreateModal} />

      {selectedProduct && (
        <EditProductModal
          open={editModalOpen}
          onClose={handleCloseEditModal}
          product={selectedProduct}
        />
      )}
    </Container>
  );
};

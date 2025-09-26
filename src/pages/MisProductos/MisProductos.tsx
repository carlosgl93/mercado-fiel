import { DashboardHeader, MobileActionBar } from '@/components';
import { Product } from '@/types/products';
import { Add as AddIcon, Inventory as InventoryIcon } from '@mui/icons-material';
import { alpha, Box, Button, Container, Tab, Tabs, useMediaQuery, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

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

  const handleBackToDashboard = () => {
    navigate('/proveedor-dashboard');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'grey.50',
        py: 3,
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <DashboardHeader
          title="Mis Productos"
          description="Gestiona tu catálogo de productos y configuración de descuentos"
          icon={<InventoryIcon sx={{ fontSize: 32 }} />}
          breadcrumbs={[
            {
              label: 'Dashboard',
              onClick: handleBackToDashboard,
            },
            {
              label: 'Mis Productos',
            },
          ]}
          onBack={handleBackToDashboard}
          actions={
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateProduct}
              sx={{
                bgcolor: 'primary.contrastText',
                color: 'primary.main',
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.contrastText, 0.9),
                },
              }}
            >
              Nuevo Producto
            </Button>
          }
        />

        {/* Mobile Action Bar */}
        {isMobile && (
          <MobileActionBar>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateProduct}
              fullWidth
              size="large"
            >
              Nuevo Producto
            </Button>
          </MobileActionBar>
        )}

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
    </Box>
  );
};

# DashboardHeader & MobileActionBar Usage Examples

This documentation shows how to use the new reusable `DashboardHeader` and `MobileActionBar` components across different sections of the supplier and customer dashboards.

## DashboardHeader Component

### Basic Usage

```tsx
import { DashboardHeader } from '@/components';
import { ShoppingCart as ShoppingCartIcon } from '@mui/icons-material';

const MyPage = () => {
  const navigate = useNavigate();

  return (
    <DashboardHeader
      title="Mis Productos"
      description="Gestiona tu catálogo de productos"
      icon={<ShoppingCartIcon sx={{ fontSize: 32 }} />}
      breadcrumbs={[
        {
          label: 'Dashboard',
          onClick: () => navigate('/proveedor-dashboard'),
        },
        {
          label: 'Mis Productos',
        },
      ]}
      onBack={() => navigate('/proveedor-dashboard')}
    />
  );
};
```

### With Actions

```tsx
import { DashboardHeader } from '@/components';
import { Add as AddIcon, Visibility as VisibilityIcon } from '@mui/icons-material';

const ProductsPage = () => {
  return (
    <DashboardHeader
      title="Mis Productos"
      description="Gestiona tu catálogo de productos"
      icon={<ShoppingCartIcon sx={{ fontSize: 32 }} />}
      breadcrumbs={[
        { label: 'Dashboard', onClick: () => navigate('/proveedor-dashboard') },
        { label: 'Mis Productos' },
      ]}
      onBack={() => navigate('/proveedor-dashboard')}
      actions={
        <>
          <Button
            variant="outlined"
            startIcon={<VisibilityIcon />}
            onClick={() => setShowPreview(true)}
          >
            Vista Previa
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/agregar-producto')}
          >
            Agregar Producto
          </Button>
        </>
      }
    />
  );
};
```

### Custom Colors

```tsx
<DashboardHeader
  title="Campañas Colectivas"
  description="Crea campañas de compra grupal"
  backgroundColor="#4CAF50"
  textColor="#ffffff"
  // ... other props
/>
```

## MobileActionBar Component

### Basic Usage

```tsx
import { MobileActionBar } from '@/components';
import { Add as AddIcon } from '@mui/icons-material';

const ProductsPage = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <>
      {/* Header */}
      <DashboardHeader {...headerProps} />
      
      {/* Mobile Actions */}
      {isMobile && (
        <MobileActionBar>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/agregar-producto')}
            size="large"
            fullWidth
          >
            Agregar Producto
          </Button>
        </MobileActionBar>
      )}
    </>
  );
};
```

### Multiple Actions

```tsx
{isMobile && (
  <MobileActionBar>
    <Box display="flex" gap={1}>
      <Button
        variant="outlined"
        startIcon={<VisibilityIcon />}
        onClick={() => setShowPreview(true)}
        size="large"
        sx={{ flex: 1 }}
      >
        Vista Previa
      </Button>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => navigate('/agregar-producto')}
        size="large"
        sx={{ flex: 1 }}
      >
        Agregar
      </Button>
    </Box>
  </MobileActionBar>
)}
```

### Custom Styling

```tsx
<MobileActionBar
  sticky={false}
  backgroundColor="rgba(76, 175, 79, 0.1)"
  borderColor="rgba(76, 175, 79, 0.3)"
  sx={{ mb: 3 }}
>
  {/* Actions */}
</MobileActionBar>
```

## Real-World Examples

### 1. Products Management Page

```tsx
import { DashboardHeader, MobileActionBar } from '@/components';
import { 
  ShoppingCart as ShoppingCartIcon,
  Add as AddIcon,
  FilterList as FilterIcon 
} from '@mui/icons-material';

export const MisProductos = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', py: 3 }}>
      <Container maxWidth="lg">
        <DashboardHeader
          title="Mis Productos"
          description="Gestiona tu catálogo de productos y mantén tu inventario actualizado"
          icon={<ShoppingCartIcon sx={{ fontSize: 32 }} />}
          breadcrumbs={[
            {
              label: 'Dashboard',
              onClick: () => navigate('/proveedor-dashboard'),
            },
            {
              label: 'Mis Productos',
            },
          ]}
          onBack={() => navigate('/proveedor-dashboard')}
          actions={
            <>
              <Button
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={() => setShowFilters(true)}
              >
                Filtros
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/agregar-producto')}
              >
                Agregar Producto
              </Button>
            </>
          }
        />

        {isMobile && (
          <MobileActionBar>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/agregar-producto')}
              size="large"
              fullWidth
            >
              Agregar Producto
            </Button>
          </MobileActionBar>
        )}

        {/* Page Content */}
        {/* ... */}
      </Container>
    </Box>
  );
};
```

### 2. Order Management Page

```tsx
export const PedidosVentas = () => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', py: 3 }}>
      <Container maxWidth="lg">
        <DashboardHeader
          title="Pedidos y Ventas"
          description="Administra tus pedidos y mantén un historial de ventas"
          icon={<ReceiptIcon sx={{ fontSize: 32 }} />}
          breadcrumbs={[
            {
              label: 'Dashboard',
              onClick: () => navigate('/proveedor-dashboard'),
            },
            {
              label: 'Pedidos y Ventas',
            },
          ]}
          onBack={() => navigate('/proveedor-dashboard')}
          actions={
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={() => handleExportData()}
            >
              Exportar Datos
            </Button>
          }
        />

        {/* Page Content */}
        {/* ... */}
      </Container>
    </Box>
  );
};
```

### 3. Customer Dashboard Page

```tsx
export const MisPedidos = () => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', py: 3 }}>
      <Container maxWidth="lg">
        <DashboardHeader
          title="Mis Pedidos"
          description="Revisa el estado de tus pedidos y el historial de compras"
          icon={<ShoppingBagIcon sx={{ fontSize: 32 }} />}
          backgroundColor="secondary.main"
          textColor="secondary.contrastText"
          breadcrumbs={[
            {
              label: 'Dashboard',
              onClick: () => navigate('/usuario-dashboard'),
            },
            {
              label: 'Mis Pedidos',
            },
          ]}
          onBack={() => navigate('/usuario-dashboard')}
        />

        {/* Page Content */}
        {/* ... */}
      </Container>
    </Box>
  );
};
```

## Props Reference

### DashboardHeader Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `title` | `string` | ✓ | Page title displayed in desktop view |
| `description` | `string` | | Page description displayed below the title |
| `icon` | `ReactNode` | | Icon to display next to the title |
| `breadcrumbs` | `BreadcrumbItem[]` | ✓ | Breadcrumb navigation items |
| `onBack` | `() => void` | ✓ | Handler for the back button |
| `actions` | `ReactNode` | | Additional action buttons for desktop |
| `backgroundColor` | `string` | | Custom background color |
| `textColor` | `string` | | Custom text color |

### MobileActionBar Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `ReactNode` | ✓ | Actions to display in the mobile action bar |
| `sticky` | `boolean` | | Whether the action bar should be sticky (default: true) |
| `backgroundColor` | `string` | | Custom background color with transparency |
| `borderColor` | `string` | | Custom border color |
| `sx` | `object` | | Additional styling props |

### BreadcrumbItem Interface

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `label` | `string` | ✓ | Text to display for the breadcrumb |
| `href` | `string` | | URL for the breadcrumb link |
| `onClick` | `() => void` | | Click handler for the breadcrumb |

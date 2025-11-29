import {
  getSupplierOverview,
  getSupplierProducts,
  getSupplierTrends,
} from '@/api/analytics';
import { useAuth } from '@/hooks/useAuthSupabase';
import {
  AddShoppingCart as CartAddIcon,
  Inventory as InventoryIcon,
  ShoppingCart as ShoppingCartIcon,
  TrendingUp as TrendingUpIcon,
  RemoveRedEye as ViewsIcon
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  Paper,
  Tab,
  Tabs,
  Typography,
  useTheme,
} from '@mui/material';
import { useState } from 'react';
import { useQuery } from 'react-query';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type DateRange = '7d' | '30d' | '90d' | 'all';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color: string;
  trend?: number;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, subtitle, icon, color, trend }) => {
  const theme = useTheme();
  
  return (
    <Card elevation={2} sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight="bold" color={color}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary" mt={0.5}>
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              backgroundColor: `${color}20`,
              borderRadius: 2,
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
        </Box>
        {trend !== undefined && (
          <Box display="flex" alignItems="center" gap={0.5}>
            <TrendingUpIcon
              fontSize="small"
              sx={{ color: trend >= 0 ? 'success.main' : 'error.main' }}
            />
            <Typography
              variant="body2"
              color={trend >= 0 ? 'success.main' : 'error.main'}
              fontWeight="medium"
            >
              {trend >= 0 ? '+' : ''}{trend}% vs periodo anterior
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export const EstadisticasProveedor: React.FC = () => {
  const theme = useTheme();
  const { user, supplier } = useAuth();
  const [dateRange, setDateRange] = useState<DateRange>('30d');
  const [activeTab, setActiveTab] = useState(0);

  const supplierId = supplier?.idProveedor;

  // Calculate date range
  const getDateRange = () => {
    const end = new Date();
    const start = new Date();
    
    switch (dateRange) {
      case '7d':
        start.setDate(start.getDate() - 7);
        break;
      case '30d':
        start.setDate(start.getDate() - 30);
        break;
      case '90d':
        start.setDate(start.getDate() - 90);
        break;
      case 'all':
        start.setFullYear(2020); // Set far back date
        break;
    }
    
    return {
      startDate: start.toISOString(),
      endDate: end.toISOString(),
    };
  };

  const { startDate, endDate } = getDateRange();

  // Fetch analytics overview
  const { data: overview, isLoading: isLoadingOverview } = useQuery(
    ['supplier-overview', supplierId, dateRange],
    () => getSupplierOverview(supplierId!, startDate, endDate),
    {
      enabled: !!supplierId,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  // Fetch product performance
  const { data: productsData, isLoading: isLoadingProducts } = useQuery(
    ['supplier-products', supplierId, dateRange],
    () => getSupplierProducts(supplierId!, startDate, endDate, 10),
    {
      enabled: !!supplierId,
      staleTime: 5 * 60 * 1000,
    }
  );

  // Fetch trends
  const { data: trendsData, isLoading: isLoadingTrends } = useQuery(
    ['supplier-trends', supplierId, dateRange],
    () => getSupplierTrends(supplierId!, startDate, endDate, dateRange === '7d' ? 'day' : 'day'),
    {
      enabled: !!supplierId,
      staleTime: 5 * 60 * 1000,
    }
  );

  if (!supplierId) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning">
          Debes ser un proveedor para acceder a esta página
        </Alert>
      </Container>
    );
  }

  const isLoading = isLoadingOverview || isLoadingProducts || isLoadingTrends;

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  const metrics = overview?.metrics;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Panel de Estadísticas
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Análisis de rendimiento y métricas de tu negocio
        </Typography>
      </Box>

      {/* Date Range Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={dateRange}
          onChange={(_, value) => setDateRange(value)}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Últimos 7 días" value="7d" />
          <Tab label="Últimos 30 días" value="30d" />
          <Tab label="Últimos 90 días" value="90d" />
          <Tab label="Todo el tiempo" value="all" />
        </Tabs>
      </Paper>

      {/* KPI Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Vistas de Perfil"
            value={metrics?.profileViews || 0}
            subtitle={`${metrics?.uniqueVisitors || 0} visitantes únicos`}
            icon={<ViewsIcon sx={{ color: theme.palette.primary.main, fontSize: 32 }} />}
            color={theme.palette.primary.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Vistas de Productos"
            value={metrics?.productViews || 0}
            subtitle="Total de visualizaciones"
            icon={<InventoryIcon sx={{ color: theme.palette.info.main, fontSize: 32 }} />}
            color={theme.palette.info.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Agregados al Carrito"
            value={metrics?.cartAdditions || 0}
            subtitle={`${metrics?.addToCartRate || 0}% tasa de conversión`}
            icon={<CartAddIcon sx={{ color: theme.palette.success.main, fontSize: 32 }} />}
            color={theme.palette.success.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Compras Realizadas"
            value={metrics?.purchases || 0}
            subtitle={`${metrics?.purchaseRate || 0}% tasa de compra`}
            icon={<ShoppingCartIcon sx={{ color: theme.palette.warning.main, fontSize: 32 }} />}
            color={theme.palette.warning.main}
          />
        </Grid>
      </Grid>

      {/* Conversion Metrics */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={4}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Tasa de Conversión Global
              </Typography>
              <Typography variant="h3" color="primary" fontWeight="bold">
                {metrics?.overallConversionRate || 0}%
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>
                De visitantes a compradores
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Participación en Campañas
              </Typography>
              <Typography variant="h3" color="secondary" fontWeight="bold">
                {metrics?.campaignJoins || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>
                Usuarios en compras colectivas
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Tasa Carrito → Compra
              </Typography>
              <Typography variant="h3" color="success.main" fontWeight="bold">
                {metrics?.purchaseRate || 0}%
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>
                Efectividad del carrito
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} mb={4}>
        {/* Traffic Trends */}
        <Grid item xs={12} lg={8}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Tendencias de Tráfico
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={trendsData?.trends || []}>
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.8} />
                      <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorCart" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={theme.palette.success.main} stopOpacity={0.8} />
                      <stop offset="95%" stopColor={theme.palette.success.main} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="productViews"
                    name="Vistas de Productos"
                    stroke={theme.palette.primary.main}
                    fillOpacity={1}
                    fill="url(#colorViews)"
                  />
                  <Area
                    type="monotone"
                    dataKey="cartAdditions"
                    name="Agregados al Carrito"
                    stroke={theme.palette.success.main}
                    fillOpacity={1}
                    fill="url(#colorCart)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Conversion Funnel */}
        <Grid item xs={12} lg={4}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Embudo de Conversión
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={[
                    { name: 'Vistas', value: metrics?.productViews || 0 },
                    { name: 'Carrito', value: metrics?.cartAdditions || 0 },
                    { name: 'Compras', value: metrics?.purchases || 0 },
                  ]}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" />
                  <Tooltip />
                  <Bar dataKey="value" fill={theme.palette.primary.main} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Top Products Table */}
      <Card elevation={2} sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Productos con Mejor Rendimiento
          </Typography>
          <Box sx={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${theme.palette.divider}` }}>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Producto</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Vistas</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Agregados</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Compras</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Tasa Carrito</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Tasa Compra</th>
                </tr>
              </thead>
              <tbody>
                {productsData?.products.map((product) => (
                  <tr
                    key={product.id_producto}
                    style={{ borderBottom: `1px solid ${theme.palette.divider}` }}
                  >
                    <td style={{ padding: '12px' }}>
                      <Box display="flex" alignItems="center" gap={2}>
                        {product.imagen_url && (
                          <img
                            src={product.imagen_url}
                            alt={product.nombre_producto}
                            style={{
                              width: 40,
                              height: 40,
                              objectFit: 'cover',
                              borderRadius: 4,
                            }}
                          />
                        )}
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {product.nombre_producto}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ${Number(product.precio_unitario).toLocaleString('es-CL')}
                          </Typography>
                        </Box>
                      </Box>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <Typography variant="body2">{product.views}</Typography>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <Typography variant="body2">{product.cartAdds}</Typography>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <Typography variant="body2">{product.purchases}</Typography>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <Typography
                        variant="body2"
                        color={product.addToCartRate > 10 ? 'success.main' : 'text.primary'}
                        fontWeight={product.addToCartRate > 10 ? 'bold' : 'normal'}
                      >
                        {product.addToCartRate}%
                      </Typography>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <Typography
                        variant="body2"
                        color={product.conversionRate > 20 ? 'success.main' : 'text.primary'}
                        fontWeight={product.conversionRate > 20 ? 'bold' : 'normal'}
                      >
                        {product.conversionRate}%
                      </Typography>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
          {(!productsData?.products || productsData.products.length === 0) && (
            <Box py={4} textAlign="center">
              <Typography variant="body2" color="text.secondary">
                No hay datos de productos para este período
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Daily Activity Chart */}
      <Card elevation={2}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Actividad Diaria
          </Typography>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={trendsData?.trends || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="profileViews"
                name="Vistas de Perfil"
                stroke={theme.palette.primary.main}
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="productViews"
                name="Vistas de Productos"
                stroke={theme.palette.info.main}
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="cartAdditions"
                name="Agregados al Carrito"
                stroke={theme.palette.success.main}
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="purchases"
                name="Compras"
                stroke={theme.palette.warning.main}
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="campaignJoins"
                name="Participaciones en Campañas"
                stroke={theme.palette.secondary.main}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </Container>
  );
};

export default EstadisticasProveedor;

import {
  Assessment,
  Inventory,
  LocalShipping,
  TrendingUp,
  Warning,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  LinearProgress,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';

interface ProductStockInfo {
  id_producto: number;
  nombre_producto: string;
  stock_actual: number;
  stock_minimo: number;
  stock_maximo: number;
  imagen_url: string | null;
}

interface StockAnalytics {
  product: ProductStockInfo;
  stock_status: {
    current_stock: number;
    reserved_stock: number;
    available_stock: number;
    stock_percentage: number;
    is_low_stock: boolean;
    days_until_stockout: number | null;
  };
  movement_stats: {
    by_type: Array<{
      tipo_movimiento: string;
      _sum: { cantidad: number };
      _count: { _all: number };
    }>;
  };
  recent_movements: Array<{
    id_movimiento: number;
    tipo_movimiento: string;
    cantidad: number;
    fecha_movimiento: string;
  }>;
  active_reservations: {
    _sum: { cantidad_reservada: number | null };
    _count: { _all: number };
  };
  alerts: {
    total: number;
    unresolved: number;
  };
}

interface StockDashboardProps {
  productId: number;
}

export const StockDashboard: React.FC<StockDashboardProps> = ({ productId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<StockAnalytics | null>(null);

  useEffect(() => {
    fetchStockAnalytics();
  }, [productId]);

  const fetchStockAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      // Replace with your actual API endpoint
      const response = await fetch(`/api/stock/analytics/product/${productId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch stock analytics');
      }

      const data = await response.json();
      setAnalytics(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!analytics) {
    return (
      <Alert severity="info" sx={{ my: 2 }}>
        No stock data available
      </Alert>
    );
  }

  const { product, stock_status, movement_stats, recent_movements, active_reservations, alerts } = analytics;

  const stockPercentage = (stock_status.current_stock / product.stock_maximo) * 100;

  const getStockColor = (): 'error' | 'warning' | 'success' => {
    if (stock_status.is_low_stock) return 'error';
    if (stockPercentage < 50) return 'warning';
    return 'success';
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Stock Dashboard - {product.nombre_producto}
      </Typography>

      {/* Stock Status Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Current Stock */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Inventory color="primary" />
                <Typography variant="subtitle2" color="text.secondary">
                  Stock Actual
                </Typography>
              </Box>
              <Typography variant="h4">{stock_status.current_stock}</Typography>
              <Typography variant="caption" color="text.secondary">
                Mínimo: {product.stock_minimo} | Máximo: {product.stock_maximo}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={Math.min(stockPercentage, 100)}
                color={getStockColor()}
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Available Stock */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <TrendingUp color="success" />
                <Typography variant="subtitle2" color="text.secondary">
                  Stock Disponible
                </Typography>
              </Box>
              <Typography variant="h4">{stock_status.available_stock}</Typography>
              <Typography variant="caption" color="text.secondary">
                Sin reservas
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Reserved Stock */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <LocalShipping color="info" />
                <Typography variant="subtitle2" color="text.secondary">
                  Stock Reservado
                </Typography>
              </Box>
              <Typography variant="h4">{stock_status.reserved_stock}</Typography>
              <Typography variant="caption" color="text.secondary">
                {active_reservations._count._all} reservas activas
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Alerts */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Warning color={alerts.unresolved > 0 ? 'warning' : 'disabled'} />
                <Typography variant="subtitle2" color="text.secondary">
                  Alertas
                </Typography>
              </Box>
              <Typography variant="h4">{alerts.unresolved}</Typography>
              <Typography variant="caption" color="text.secondary">
                Sin resolver (Total: {alerts.total})
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Stock Status Alert */}
      {stock_status.is_low_stock && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="subtitle2">⚠️ Stock Bajo</Typography>
          <Typography variant="body2">
            El stock actual ({stock_status.current_stock}) está por debajo del mínimo ({product.stock_minimo}).
            {stock_status.days_until_stockout !== null && (
              <> Se agotará en aproximadamente {stock_status.days_until_stockout} días.</>
            )}
          </Typography>
        </Alert>
      )}

      {/* Movement Statistics */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <Assessment color="primary" />
            <Typography variant="h6">Estadísticas de Movimientos</Typography>
          </Box>

          <Grid container spacing={2}>
            {movement_stats.by_type.map((stat) => (
              <Grid item xs={12} sm={6} md={4} key={stat.tipo_movimiento}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      {formatMovementType(stat.tipo_movimiento)}
                    </Typography>
                    <Typography variant="h6">{stat._sum.cantidad} unidades</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {stat._count._all} movimientos
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Recent Movements */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Movimientos Recientes
          </Typography>

          {recent_movements.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No hay movimientos recientes
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {recent_movements.map((movement) => (
                <Box
                  key={movement.id_movimiento}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                  }}
                >
                  <Box>
                    <Typography variant="body2">
                      {formatMovementType(movement.tipo_movimiento)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(movement.fecha_movimiento).toLocaleString('es-CL')}
                    </Typography>
                  </Box>
                  <Chip
                    label={`${movement.tipo_movimiento.startsWith('ENTRADA') ? '+' : '-'}${movement.cantidad}`}
                    color={movement.tipo_movimiento.startsWith('ENTRADA') ? 'success' : 'error'}
                    size="small"
                  />
                </Box>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

// Helper function to format movement types
const formatMovementType = (type: string): string => {
  const typeMap: Record<string, string> = {
    ENTRADA_COMPRA: 'Entrada - Compra',
    ENTRADA_DEVOLUCION: 'Entrada - Devolución',
    ENTRADA_AJUSTE: 'Entrada - Ajuste',
    ENTRADA_REABASTECIMIENTO: 'Entrada - Reabastecimiento',
    SALIDA_VENTA: 'Salida - Venta',
    SALIDA_DEVOLUCION: 'Salida - Devolución',
    SALIDA_AJUSTE: 'Salida - Ajuste',
    SALIDA_MERMA: 'Salida - Merma',
  };

  return typeMap[type] || type;
};

export default StockDashboard;

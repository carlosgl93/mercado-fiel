import {
  CheckCircle,
  Error as ErrorIcon,
  Info as InfoIcon,
  Refresh,
  Warning as WarningIcon,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
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
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';

interface StockAlert {
  id_alerta: number;
  id_producto: number;
  tipo_alerta: string;
  stock_actual: number;
  stock_minimo: number | null;
  mensaje: string;
  resuelta: boolean;
  fecha_alerta: string;
  fecha_resolucion: string | null;
  observaciones_resolucion: string | null;
  producto: {
    nombre_producto: string;
    imagen_url: string | null;
  };
}

interface AlertsResponse {
  alerts: StockAlert[];
  total: number;
  page: number;
  totalPages: number;
}

export const StockAlerts: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterType, setFilterType] = useState<string>('all');
  const [showResolved, setShowResolved] = useState(false);
  const [resolveDialogOpen, setResolveDialogOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<StockAlert | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');

  useEffect(() => {
    fetchAlerts();
  }, [page, filterType, showResolved]);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
      });

      if (filterType !== 'all') {
        params.append('tipo_alerta', filterType);
      }

      if (!showResolved) {
        params.append('resuelta', 'false');
      }

      const response = await fetch(`/api/stock/alerts?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to fetch alerts');
      }

      const data: AlertsResponse = await response.json();
      setAlerts(data.alerts);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = (alert: StockAlert) => {
    setSelectedAlert(alert);
    setResolutionNotes('');
    setResolveDialogOpen(true);
  };

  const handleConfirmResolve = async () => {
    if (!selectedAlert) return;

    try {
      const response = await fetch(`/api/stock/alerts/${selectedAlert.id_alerta}/resolve`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          observaciones_resolucion: resolutionNotes,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to resolve alert');
      }

      // Refresh alerts
      await fetchAlerts();
      setResolveDialogOpen(false);
      setSelectedAlert(null);
      setResolutionNotes('');
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const getAlertIcon = (tipo: string) => {
    switch (tipo) {
      case 'STOCK_AGOTADO':
        return <ErrorIcon color="error" />;
      case 'STOCK_BAJO':
        return <WarningIcon color="warning" />;
      case 'STOCK_EXCEDIDO':
        return <InfoIcon color="info" />;
      case 'VENCIMIENTO_PROXIMO':
        return <WarningIcon color="warning" />;
      default:
        return <InfoIcon color="info" />;
    }
  };

  const getAlertColor = (tipo: string): 'error' | 'warning' | 'info' | 'success' => {
    switch (tipo) {
      case 'STOCK_AGOTADO':
        return 'error';
      case 'STOCK_BAJO':
        return 'warning';
      case 'STOCK_EXCEDIDO':
        return 'info';
      default:
        return 'info';
    }
  };

  const formatAlertType = (type: string): string => {
    const typeMap: Record<string, string> = {
      STOCK_BAJO: 'Stock Bajo',
      STOCK_AGOTADO: 'Stock Agotado',
      STOCK_EXCEDIDO: 'Stock Excedido',
      VENCIMIENTO_PROXIMO: 'Vencimiento Próximo',
    };
    return typeMap[type] || type;
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

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Alertas de Stock</Typography>
        <Box display="flex" gap={2}>
          <IconButton onClick={fetchAlerts} color="primary">
            <Refresh />
          </IconButton>
        </Box>
      </Box>

      {/* Filters */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth>
            <InputLabel>Tipo de Alerta</InputLabel>
            <Select
              value={filterType}
              label="Tipo de Alerta"
              onChange={(e) => {
                setFilterType(e.target.value);
                setPage(1);
              }}
            >
              <MenuItem value="all">Todas</MenuItem>
              <MenuItem value="STOCK_BAJO">Stock Bajo</MenuItem>
              <MenuItem value="STOCK_AGOTADO">Stock Agotado</MenuItem>
              <MenuItem value="STOCK_EXCEDIDO">Stock Excedido</MenuItem>
              <MenuItem value="VENCIMIENTO_PROXIMO">Vencimiento Próximo</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Button
            variant={showResolved ? 'contained' : 'outlined'}
            onClick={() => {
              setShowResolved(!showResolved);
              setPage(1);
            }}
            fullWidth
          >
            {showResolved ? 'Ocultar Resueltas' : 'Mostrar Resueltas'}
          </Button>
        </Grid>
      </Grid>

      {/* Summary */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          Total de alertas: <strong>{total}</strong>
          {!showResolved && ' (sin resolver)'}
        </Typography>
      </Alert>

      {/* Alerts List */}
      {alerts.length === 0 ? (
        <Card>
          <CardContent>
            <Typography variant="body1" color="text.secondary" align="center">
              {showResolved
                ? 'No hay alertas disponibles'
                : '✅ No hay alertas sin resolver. ¡Todo está en orden!'}
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {alerts.map((alert) => (
            <Card
              key={alert.id_alerta}
              sx={{
                borderLeft: `4px solid`,
                borderColor: `${getAlertColor(alert.tipo_alerta)}.main`,
              }}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Box display="flex" gap={2} flex={1}>
                    <Box>{getAlertIcon(alert.tipo_alerta)}</Box>
                    <Box flex={1}>
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <Typography variant="h6">{alert.producto.nombre_producto}</Typography>
                        <Chip
                          label={formatAlertType(alert.tipo_alerta)}
                          color={getAlertColor(alert.tipo_alerta)}
                          size="small"
                        />
                        {alert.resuelta && (
                          <Chip
                            icon={<CheckCircle />}
                            label="Resuelta"
                            color="success"
                            size="small"
                          />
                        )}
                      </Box>

                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {alert.mensaje}
                      </Typography>

                      <Typography variant="caption" color="text.secondary">
                        Stock Actual: <strong>{alert.stock_actual}</strong>
                        {alert.stock_minimo && ` | Mínimo: ${alert.stock_minimo}`}
                      </Typography>

                      <Box mt={1}>
                        <Typography variant="caption" color="text.secondary">
                          Fecha: {new Date(alert.fecha_alerta).toLocaleString('es-CL')}
                        </Typography>
                      </Box>

                      {alert.resuelta && (
                        <Box mt={1}>
                          <Typography variant="caption" color="success.main">
                            ✓ Resuelta:{' '}
                            {alert.fecha_resolucion &&
                              new Date(alert.fecha_resolucion).toLocaleString('es-CL')}
                          </Typography>
                          {alert.observaciones_resolucion && (
                            <Typography variant="caption" display="block" color="text.secondary">
                              Notas: {alert.observaciones_resolucion}
                            </Typography>
                          )}
                        </Box>
                      )}
                    </Box>
                  </Box>

                  {!alert.resuelta && (
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => handleResolve(alert)}
                    >
                      Resolver
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" gap={1} mt={3}>
          <Button
            variant="outlined"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Anterior
          </Button>
          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', px: 2 }}>
            Página {page} de {totalPages}
          </Typography>
          <Button
            variant="outlined"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Siguiente
          </Button>
        </Box>
      )}

      {/* Resolve Dialog */}
      <Dialog
        open={resolveDialogOpen}
        onClose={() => setResolveDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Resolver Alerta</DialogTitle>
        <DialogContent>
          {selectedAlert && (
            <>
              <Typography variant="body2" gutterBottom>
                <strong>Producto:</strong> {selectedAlert.producto.nombre_producto}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Tipo:</strong> {formatAlertType(selectedAlert.tipo_alerta)}
              </Typography>
              <Typography variant="body2" gutterBottom mb={2}>
                <strong>Mensaje:</strong> {selectedAlert.mensaje}
              </Typography>

              <TextField
                fullWidth
                multiline
                rows={4}
                label="Observaciones de Resolución"
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                placeholder="Describe cómo se resolvió esta alerta..."
                sx={{ mt: 2 }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResolveDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleConfirmResolve} variant="contained" color="primary">
            Marcar como Resuelta
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StockAlerts;

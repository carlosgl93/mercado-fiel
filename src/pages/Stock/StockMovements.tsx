import {
  Add as AddIcon,
  FilterList,
  Refresh,
  Remove as RemoveIcon,
  TrendingDown,
  TrendingUp,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';

interface StockMovement {
  id_movimiento: number;
  id_producto: number;
  tipo_movimiento: string;
  cantidad: number;
  stock_previo: number;
  stock_resultante: number;
  metodo_registro: string;
  observaciones: string | null;
  fecha_movimiento: string;
  producto: {
    nombre_producto: string;
    imagen_url: string | null;
  };
}

interface MovementsResponse {
  movements: StockMovement[];
  total: number;
  page: number;
  totalPages: number;
}

export const StockMovements: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Filters
  const [filterType, setFilterType] = useState<string>('all');
  const [productIdFilter, setProductIdFilter] = useState<string>('');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');

  useEffect(() => {
    fetchMovements();
  }, [page, filterType, productIdFilter, dateFrom, dateTo]);

  const fetchMovements = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
      });

      if (filterType !== 'all') {
        params.append('tipo_movimiento', filterType);
      }

      if (productIdFilter) {
        params.append('product_id', productIdFilter);
      }

      if (dateFrom) {
        params.append('fecha_desde', new Date(dateFrom).toISOString());
      }

      if (dateTo) {
        params.append('fecha_hasta', new Date(dateTo).toISOString());
      }

      const response = await fetch(`/api/stock/movements?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to fetch movements');
      }

      const data: MovementsResponse = await response.json();
      setMovements(data.movements);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setFilterType('all');
    setProductIdFilter('');
    setDateFrom('');
    setDateTo('');
    setPage(1);
  };

  const getMovementIcon = (tipo: string) => {
    return tipo.startsWith('ENTRADA') ? (
      <TrendingUp color="success" />
    ) : (
      <TrendingDown color="error" />
    );
  };

  const getMovementColor = (tipo: string): 'success' | 'error' | 'info' | 'warning' => {
    if (tipo.startsWith('ENTRADA')) return 'success';
    if (tipo.includes('AJUSTE')) return 'warning';
    if (tipo.startsWith('SALIDA')) return 'error';
    return 'info';
  };

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

  const formatRegistrationMethod = (method: string): string => {
    const methodMap: Record<string, string> = {
      MANUAL: 'Manual',
      AUTOMATICO: 'Automático',
      WHATSAPP: 'WhatsApp',
    };
    return methodMap[method] || method;
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
        <Typography variant="h4">Historial de Movimientos</Typography>
        <IconButton onClick={fetchMovements} color="primary">
          <Refresh />
        </IconButton>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <FilterList />
            <Typography variant="h6">Filtros</Typography>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Tipo de Movimiento</InputLabel>
                <Select
                  value={filterType}
                  label="Tipo de Movimiento"
                  onChange={(e) => {
                    setFilterType(e.target.value);
                    setPage(1);
                  }}
                >
                  <MenuItem value="all">Todos</MenuItem>
                  <MenuItem value="ENTRADA_COMPRA">Entrada - Compra</MenuItem>
                  <MenuItem value="ENTRADA_DEVOLUCION">Entrada - Devolución</MenuItem>
                  <MenuItem value="ENTRADA_AJUSTE">Entrada - Ajuste</MenuItem>
                  <MenuItem value="ENTRADA_REABASTECIMIENTO">Entrada - Reabastecimiento</MenuItem>
                  <MenuItem value="SALIDA_VENTA">Salida - Venta</MenuItem>
                  <MenuItem value="SALIDA_DEVOLUCION">Salida - Devolución</MenuItem>
                  <MenuItem value="SALIDA_AJUSTE">Salida - Ajuste</MenuItem>
                  <MenuItem value="SALIDA_MERMA">Salida - Merma</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="ID de Producto"
                type="number"
                value={productIdFilter}
                onChange={(e) => {
                  setProductIdFilter(e.target.value);
                  setPage(1);
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                label="Desde"
                type="date"
                value={dateFrom}
                onChange={(e) => {
                  setDateFrom(e.target.value);
                  setPage(1);
                }}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                label="Hasta"
                type="date"
                value={dateTo}
                onChange={(e) => {
                  setDateTo(e.target.value);
                  setPage(1);
                }}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleClearFilters}
                sx={{ height: '56px' }}
              >
                Limpiar Filtros
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Summary */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          Total de movimientos: <strong>{total}</strong>
        </Typography>
      </Alert>

      {/* Movements Table */}
      {movements.length === 0 ? (
        <Card>
          <CardContent>
            <Typography variant="body1" color="text.secondary" align="center">
              No hay movimientos que mostrar
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Fecha</TableCell>
                <TableCell>Producto</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell align="center">Cantidad</TableCell>
                <TableCell align="center">Stock Previo</TableCell>
                <TableCell align="center">Stock Resultante</TableCell>
                <TableCell>Método</TableCell>
                <TableCell>Observaciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {movements.map((movement) => (
                <TableRow key={movement.id_movimiento} hover>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(movement.fecha_movimiento).toLocaleDateString('es-CL')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(movement.fecha_movimiento).toLocaleTimeString('es-CL')}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2">{movement.producto.nombre_producto}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      ID: {movement.id_producto}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      {getMovementIcon(movement.tipo_movimiento)}
                      <Chip
                        label={formatMovementType(movement.tipo_movimiento)}
                        color={getMovementColor(movement.tipo_movimiento)}
                        size="small"
                      />
                    </Box>
                  </TableCell>

                  <TableCell align="center">
                    <Chip
                      icon={
                        movement.tipo_movimiento.startsWith('ENTRADA') ? (
                          <AddIcon />
                        ) : (
                          <RemoveIcon />
                        )
                      }
                      label={movement.cantidad}
                      color={
                        movement.tipo_movimiento.startsWith('ENTRADA') ? 'success' : 'error'
                      }
                      variant="outlined"
                    />
                  </TableCell>

                  <TableCell align="center">
                    <Typography variant="body2">{movement.stock_previo}</Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Typography variant="body2" fontWeight="bold">
                      {movement.stock_resultante}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={formatRegistrationMethod(movement.metodo_registro)}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>

                  <TableCell>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        maxWidth: 200,
                        display: 'block',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {movement.observaciones || '-'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" gap={1} mt={3}>
          <Button variant="outlined" disabled={page === 1} onClick={() => setPage(page - 1)}>
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
    </Box>
  );
};

export default StockMovements;

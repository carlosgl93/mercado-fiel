import { LocalOffer as LocalOfferIcon } from '@mui/icons-material';
import {
  Box,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from '@mui/material';
import React from 'react';

interface VolumeDiscountsTableProps {
  discounts: any[];
  basePrice: number;
  unitType: string;
  formatCurrency: (amount: number) => string;
}

export const VolumeDiscountsTable: React.FC<VolumeDiscountsTableProps> = ({
  discounts,
  basePrice,
  unitType,
  formatCurrency,
}) => {
  const theme = useTheme();
  if (!discounts || discounts.length === 0) return null;

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" fontWeight="600" sx={{ mb: 2 }}>
        <LocalOfferIcon
          sx={{ mr: 1, verticalAlign: 'middle', color: theme.palette.secondary.main }}
        />
        Descuentos por Volumen
      </Typography>

      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Cantidad Mínima</TableCell>
              <TableCell>Descuento</TableCell>
              <TableCell>Precio Final</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {discounts.map((discount, index: number) => (
              <TableRow key={index}>
                <TableCell>
                  {discount.cantidadMinima} {unitType === 'kg' ? 'kg' : 'unidades'}
                </TableCell>
                <TableCell>
                  <Chip
                    label={`${discount.descuentoPorcentaje}% OFF`}
                    color="primary"
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Typography color="primary" fontWeight="600">
                    {formatCurrency(basePrice * (1 - (discount.descuentoPorcentaje || 0) / 100))}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
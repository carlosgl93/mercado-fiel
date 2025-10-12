import { Paper } from '@mui/material';
import React from 'react';
import { ProductHeader } from './ProductHeader';
import { VolumeDiscountsTable } from './VolumeDiscountsTable';

interface ProductInfoProps {
  product: any;
  onNavigateToSupplier: () => void;
  formatCurrency: (amount: number) => string;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({
  product,
  onNavigateToSupplier,
  formatCurrency,
}) => {
  return (
    <Paper sx={{ p: 4, mb: 3 }}>
      <ProductHeader 
        product={product} 
        onNavigateToSupplier={onNavigateToSupplier}
        formatCurrency={formatCurrency}
      />
      
      <VolumeDiscountsTable 
        discounts={product.descuentosCantidad} 
        basePrice={product.precioUnitario}
        unitType={product.unitType}
        formatCurrency={formatCurrency}
      />
    </Paper>
  );
};
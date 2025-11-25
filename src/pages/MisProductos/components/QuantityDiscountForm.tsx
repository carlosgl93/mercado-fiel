import { NumberInput } from '@/components/NumberInput';
import { CreateProductRequest } from '@/types/products';
import { Add as AddIcon, Delete as DeleteIcon, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  // Slider, // Commented out - using NumberInput instead
  Typography,
} from '@mui/material';
import React from 'react';
import { QuantityDiscountForm as QuantityDiscountFormType } from '../fixtures/productFixtures';
import {
  DISCOUNT_MAX_PERCENTAGE,
  DISCOUNT_MIN_PERCENTAGE,
  formatCurrencyWithUnit,
  getUnitLabel,
} from '../utils/productFormUtils';

interface QuantityDiscountFormProps {
  formData: CreateProductRequest;
  discounts: QuantityDiscountFormType[];
  errors: Record<string, string>;
  onAddDiscount: () => void;
  onRemoveDiscount: (index: number) => void;
  onUpdateDiscount: (index: number, field: keyof QuantityDiscountFormType, value: number | boolean) => void;
}

export const QuantityDiscountForm: React.FC<QuantityDiscountFormProps> = ({
  formData,
  discounts,
  errors,
  onAddDiscount,
  onRemoveDiscount,
  onUpdateDiscount,
}) => {
  return (
    <Grid item xs={12}>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Descuentos por Cantidad (Opcional)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box>
            <Typography variant="body2" color="text.secondary" paragraph>
              Configura descuentos automáticos cuando los clientes compren en cantidad
              {formData.unitType === 'kg' ? ' (kilogramos)' : ' (unidades)'}.
            </Typography>

            {discounts.map((discount, index) => (
              <DiscountCard
                key={index}
                discount={discount}
                index={index}
                formData={formData}
                errors={errors}
                onRemove={() => onRemoveDiscount(index)}
                onUpdate={onUpdateDiscount}
              />
            ))}

            <Button
              startIcon={<AddIcon />}
              onClick={onAddDiscount}
              variant="outlined"
              size="small"
            >
              Agregar Descuento
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Grid>
  );
};

interface DiscountCardProps {
  discount: QuantityDiscountFormType;
  index: number;
  formData: CreateProductRequest;
  errors: Record<string, string>;
  onRemove: () => void;
  onUpdate: (index: number, field: keyof QuantityDiscountFormType, value: number | boolean) => void;
}

const DiscountCard: React.FC<DiscountCardProps> = ({
  discount,
  index,
  formData,
  errors,
  onRemove,
  onUpdate,
}) => {
  return (
    <Box
      sx={{
        mb: 3,
        p: 3,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        backgroundColor: 'grey.50',
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="subtitle1" fontWeight="medium">
          Descuento #{index + 1}
        </Typography>
        <IconButton onClick={onRemove} size="small" color="error">
          <DeleteIcon />
        </IconButton>
      </Box>

      <Grid container spacing={3}>
        {/* Minimum Quantity */}
        <Grid item xs={12} sm={6}>
          <NumberInput
            fullWidth
            label={`Cantidad mínima (${getUnitLabel(formData.unitType)})`}
            value={discount.cantidadMinima}
            onChange={(value) => {
              if (value === null || value === undefined) {
                return;
              } else if (value < 1) {
                return;
              }
              onUpdate(index, 'cantidadMinima', value);
            }}
            error={!!errors[`discount_${index}_cantidad`]}
            helperText={errors[`discount_${index}_cantidad`]}
            min={1}
          />
        </Grid>

        {/* Discount Mode Toggle */}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Tipo de Descuento</InputLabel>
            <Select
              value={discount.isPercentageMode ? 'percentage' : 'fixed'}
              onChange={(e) =>
                onUpdate(index, 'isPercentageMode', e.target.value === 'percentage')
              }
              label="Tipo de Descuento"
            >
              <MenuItem value="percentage">Porcentaje (%)</MenuItem>
              <MenuItem value="fixed">Precio Fijo (CLP)</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Discount Slider */}
        <Grid item xs={12}>
          <DiscountSlider
            discount={discount}
            index={index}
            formData={formData}
            onUpdate={onUpdate}
          />
        </Grid>

        {/* Price Summary */}
        <Grid item xs={12}>
          <PriceSummary discount={discount} formData={formData} />
        </Grid>

        {/* Error Messages */}
        {(errors[`discount_${index}_cantidad`] ||
          errors[`discount_${index}_percentage`] ||
          errors[`discount_${index}_price`]) && (
          <Grid item xs={12}>
            <Alert severity="error">
              {errors[`discount_${index}_cantidad`] ||
                errors[`discount_${index}_percentage`] ||
                errors[`discount_${index}_price`]}
            </Alert>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

interface DiscountSliderProps {
  discount: QuantityDiscountFormType;
  index: number;
  formData: CreateProductRequest;
  onUpdate: (index: number, field: keyof QuantityDiscountFormType, value: number | boolean) => void;
}

const DiscountSlider: React.FC<DiscountSliderProps> = ({
  discount,
  index,
  formData,
  onUpdate,
}) => {
  if (discount.isPercentageMode) {
    return (
      <Box>
        <NumberInput
          fullWidth
          label="Porcentaje de descuento (%)"
          value={discount.descuentoPorcentaje}
          onChange={(value) => {
            if (value === null || value === undefined) {
              return;
            }
            // Clamp value between min and max
            const clampedValue = Math.min(
              Math.max(value, DISCOUNT_MIN_PERCENTAGE),
              DISCOUNT_MAX_PERCENTAGE,
            );
            onUpdate(index, 'descuentoPorcentaje', clampedValue);
          }}
          min={DISCOUNT_MIN_PERCENTAGE}
          max={DISCOUNT_MAX_PERCENTAGE}
          helperText={`Ingresa un valor entre ${DISCOUNT_MIN_PERCENTAGE}% y ${DISCOUNT_MAX_PERCENTAGE}%`}
        />
        {/* <Typography variant="body2" color="text.secondary" gutterBottom>
          Descuento: {discount.descuentoPorcentaje.toFixed(1)}%
        </Typography>
        <Slider
          value={discount.descuentoPorcentaje}
          onChange={(_, value) => onUpdate(index, 'descuentoPorcentaje', value as number)}
          min={DISCOUNT_MIN_PERCENTAGE}
          max={DISCOUNT_MAX_PERCENTAGE}
          step={DISCOUNT_STEP}
          marks={[
            { value: 0, label: '0%' },
            { value: 25, label: '25%' },
            { value: 50, label: '50%' },
            { value: 75, label: '75%' },
            { value: 99, label: '99%' },
          ]}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => `${value}%`}
          sx={{ mt: 2, mb: 1 }}
        /> */}
      </Box>
    );
  }

  return (
    <Box>
      <NumberInput
        fullWidth
        label={`Precio con descuento (${getUnitLabel(formData.unitType)})`}
        value={discount.precioDescuento}
        onChange={(value) => {
          if (value === null || value === undefined) {
            return;
          }
          // Clamp value between 0 and 99% of original price
          const maxPrice = formData.precioUnitario * 0.99;
          const clampedValue = Math.min(Math.max(value, 0), maxPrice);
          onUpdate(index, 'precioDescuento', clampedValue);
        }}
        min={0}
        max={formData.precioUnitario * 0.99}
        helperText={`Precio original: ${formatCurrencyWithUnit(
          formData.precioUnitario,
          formData.unitType,
        )}`}
      />
      {/* <Typography variant="body2" color="text.secondary" gutterBottom>
        Precio con descuento: {formatCurrencyWithUnit(discount.precioDescuento, formData.unitType)}
      </Typography>
      <Slider
        value={discount.precioDescuento}
        onChange={(_, value) => onUpdate(index, 'precioDescuento', value as number)}
        min={0}
        max={formData.precioUnitario * 0.99}
        step={100}
        marks={[
          { value: 0, label: formatCurrency(0) },
          {
            value: formData.precioUnitario * 0.25,
            label: formatCurrency(formData.precioUnitario * 0.25),
          },
          {
            value: formData.precioUnitario * 0.5,
            label: formatCurrency(formData.precioUnitario * 0.5),
          },
          {
            value: formData.precioUnitario * 0.75,
            label: formatCurrency(formData.precioUnitario * 0.75),
          },
          {
            value: formData.precioUnitario * 0.99,
            label: formatCurrency(formData.precioUnitario * 0.99),
          },
        ]}
        valueLabelDisplay="auto"
        valueLabelFormat={(value) => formatCurrencyWithUnit(value, formData.unitType)}
        sx={{ mt: 2, mb: 1 }}
      /> */}
    </Box>
  );
};

interface PriceSummaryProps {
  discount: QuantityDiscountFormType;
  formData: CreateProductRequest;
}

const PriceSummary: React.FC<PriceSummaryProps> = ({ discount, formData }) => {
  return (
    <Box
      sx={{
        p: 2,
        backgroundColor: 'primary.50',
        borderRadius: 1,
        border: '1px solid',
        borderColor: 'primary.200',
      }}
    >
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Resumen del descuento:
      </Typography>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="body2">
          Precio original:{' '}
          <strong>{formatCurrencyWithUnit(formData.precioUnitario, formData.unitType)}</strong>
        </Typography>
        <Typography variant="body2">
          Precio con descuento:{' '}
          <strong>{formatCurrencyWithUnit(discount.precioDescuento, formData.unitType)}</strong>
        </Typography>
      </Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
        <Typography variant="body2" color="success.main">
          Descuento: {discount.descuentoPorcentaje.toFixed(1)}%
        </Typography>
        <Typography variant="body2" color="success.main">
          Ahorro:{' '}
          <strong>
            {formatCurrencyWithUnit(
              formData.precioUnitario - discount.precioDescuento,
              formData.unitType
            )}
          </strong>
        </Typography>
      </Box>
    </Box>
  );
};

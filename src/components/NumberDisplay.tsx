import { Typography, TypographyProps } from '@mui/material';
import React from 'react';
import { NumericFormat } from 'react-number-format';

interface NumberDisplayProps extends Omit<TypographyProps, 'children'> {
  value: number | string | null | undefined;
  decimalScale?: number;
  fixedDecimalScale?: boolean;
  prefix?: string;
  suffix?: string;
  thousandSeparator?: string | boolean;
  decimalSeparator?: string;
  displayType?: 'input' | 'text';
  renderText?: (value: string, props: any) => React.ReactNode;
}

export const NumberDisplay: React.FC<NumberDisplayProps> = ({
  value,
  decimalScale = 0,
  fixedDecimalScale = false,
  prefix = '',
  suffix = '',
  thousandSeparator = '.',
  decimalSeparator = ',',
  displayType = 'text',
  renderText,
  ...typographyProps
}) => {
  const defaultRenderText = (formattedValue: string) => (
    <Typography {...typographyProps}>{formattedValue}</Typography>
  );

  return (
    <NumericFormat
      value={value}
      decimalScale={decimalScale}
      fixedDecimalScale={fixedDecimalScale}
      prefix={prefix}
      suffix={suffix}
      thousandSeparator={thousandSeparator}
      decimalSeparator={decimalSeparator}
      displayType={displayType}
      renderText={renderText || defaultRenderText}
    />
  );
};

// Specialized component for Chilean currency (CLP) display
interface CLPCurrencyDisplayProps
  extends Omit<NumberDisplayProps, 'prefix' | 'thousandSeparator' | 'decimalSeparator' | 'suffix'> {
  showCurrencySymbol?: boolean;
  showCurrencyCode?: boolean;
}

export const CLPCurrencyDisplay: React.FC<CLPCurrencyDisplayProps> = ({
  showCurrencySymbol = true,
  showCurrencyCode = false,
  decimalScale = 0,
  fixedDecimalScale = true,
  ...props
}) => {
  const prefix = showCurrencySymbol ? '$' : '';
  const suffix = showCurrencyCode ? ' CLP' : '';

  return (
    <NumberDisplay
      prefix={prefix}
      suffix={suffix}
      thousandSeparator="."
      decimalSeparator=","
      decimalScale={decimalScale}
      fixedDecimalScale={fixedDecimalScale}
      {...props}
    />
  );
};

// Specialized component for percentage display
interface PercentageDisplayProps extends Omit<NumberDisplayProps, 'suffix'> {
  showPercentSymbol?: boolean;
}

export const PercentageDisplay: React.FC<PercentageDisplayProps> = ({
  showPercentSymbol = true,
  decimalScale = 1,
  fixedDecimalScale = false,
  ...props
}) => {
  return (
    <NumberDisplay
      suffix={showPercentSymbol ? '%' : ''}
      decimalScale={decimalScale}
      fixedDecimalScale={fixedDecimalScale}
      thousandSeparator="."
      decimalSeparator=","
      {...props}
    />
  );
};

// Utility function to format currency without React component
export const formatCLP = (
  value: number | string | null | undefined,
  options?: {
    showCurrencySymbol?: boolean;
    showCurrencyCode?: boolean;
    decimalScale?: number;
  },
): string => {
  const { showCurrencySymbol = true, showCurrencyCode = false, decimalScale = 0 } = options || {};

  if (value == null || value === '') return '-';

  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numValue)) return '-';

  const formatter = new Intl.NumberFormat('es-CL', {
    style: 'decimal',
    minimumFractionDigits: decimalScale,
    maximumFractionDigits: decimalScale,
  });

  const formatted = formatter.format(numValue);
  const prefix = showCurrencySymbol ? '$' : '';
  const suffix = showCurrencyCode ? ' CLP' : '';

  return `${prefix}${formatted}${suffix}`;
};

// Utility function to format percentage without React component
export const formatPercentage = (
  value: number | string | null | undefined,
  options?: {
    decimalScale?: number;
    showPercentSymbol?: boolean;
  },
): string => {
  const { decimalScale = 1, showPercentSymbol = true } = options || {};

  if (value == null || value === '') return '-';

  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numValue)) return '-';

  const formatter = new Intl.NumberFormat('es-CL', {
    style: 'decimal',
    minimumFractionDigits: decimalScale,
    maximumFractionDigits: decimalScale,
  });

  const formatted = formatter.format(numValue);
  const suffix = showPercentSymbol ? '%' : '';

  return `${formatted}${suffix}`;
};

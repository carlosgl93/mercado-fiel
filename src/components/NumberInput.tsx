import { TextField, TextFieldProps } from '@mui/material';
import React from 'react';
import { NumericFormat } from 'react-number-format';

interface NumberInputProps extends Omit<TextFieldProps, 'onChange' | 'value' | 'defaultValue'> {
  value?: number | string;
  onChange?: (value: number | undefined) => void;
  allowNegative?: boolean;
  decimalScale?: number;
  fixedDecimalScale?: boolean;
  prefix?: string;
  suffix?: string;
  thousandSeparator?: string | boolean;
  decimalSeparator?: string;
  max?: number;
  min?: number;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  value,
  onChange,
  allowNegative = false,
  decimalScale = 0,
  fixedDecimalScale = false,
  prefix = '',
  suffix = '',
  thousandSeparator = '.',
  decimalSeparator = ',',
  max,
  min,
  type,
  ...textFieldProps
}) => {
  const handleValueChange = (values: any) => {
    const { floatValue } = values;
    onChange?.(floatValue);
  };

  return (
    <NumericFormat
      value={value}
      onValueChange={handleValueChange}
      allowNegative={allowNegative}
      decimalScale={decimalScale}
      fixedDecimalScale={fixedDecimalScale}
      prefix={prefix}
      suffix={suffix}
      thousandSeparator={thousandSeparator}
      decimalSeparator={decimalSeparator}
      isAllowed={(values) => {
        const { floatValue } = values;
        if (floatValue === undefined) return true;
        if (min !== undefined && floatValue < min) return false;
        if (max !== undefined && floatValue > max) return false;
        return true;
      }}
      customInput={TextField}
      {...textFieldProps}
    />
  );
};

// Specialized component for Chilean currency (CLP)
interface CurrencyInputProps
  extends Omit<NumberInputProps, 'prefix' | 'thousandSeparator' | 'decimalSeparator' | 'suffix'> {
  showCurrencySymbol?: boolean;
}

export const CLPCurrencyInput: React.FC<CurrencyInputProps> = ({
  showCurrencySymbol = true,
  decimalScale = 0,
  allowNegative = false,
  ...props
}) => {
  return (
    <NumberInput
      prefix={showCurrencySymbol ? '$' : ''}
      thousandSeparator="."
      decimalSeparator=","
      decimalScale={decimalScale}
      allowNegative={allowNegative}
      {...props}
    />
  );
};

// Specialized component for percentage input
interface PercentageInputProps extends Omit<NumberInputProps, 'suffix' | 'max' | 'min'> {
  maxPercentage?: number;
  minPercentage?: number;
}

export const PercentageInput: React.FC<PercentageInputProps> = ({
  maxPercentage = 100,
  minPercentage = 0,
  allowNegative = false,
  decimalScale = 2,
  ...props
}) => {
  return (
    <NumberInput
      suffix="%"
      decimalScale={decimalScale}
      thousandSeparator="."
      decimalSeparator=","
      max={maxPercentage}
      min={minPercentage}
      allowNegative={allowNegative}
      {...props}
    />
  );
};

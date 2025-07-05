import { TextField } from '@mui/material';

type StyledInputProps = {
  input: {
    label: string;
    inputName: string;
    placeholder: string;
    type: string;
  };
  value: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const StyledInput = ({ input, handleChange, value }: StyledInputProps) => {
  const { label, inputName, placeholder, type } = input;
  return (
    <TextField
      sx={{
        m: 2,
      }}
      label={label}
      name={inputName}
      variant="outlined"
      placeholder={placeholder}
      onChange={handleChange}
      type={type}
      value={value}
    />
  );
};

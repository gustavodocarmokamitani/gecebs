// src/components/common/CustomSelect.jsx
import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const CustomSelect = ({
  label,
  name,
  value,
  onChange,
  options = [],
  required,
  error,
  helperText,
  ...props
}) => {
  const theme = useTheme();

  return (
    <FormControl
      fullWidth
      required={required}
      error={error}
      sx={{
        '& .MuiInputBase-root': {
          borderRadius: 1,
          borderColor: theme.palette.divider,
          backgroundColor: theme.palette.background.paper,
        },
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.palette.divider,
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.palette.primary.main,
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.palette.primary.main,
        },
        '& .Mui-disabled .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.palette.divider,
        },
        '& .MuiInputLabel-root': {
          color: theme.palette.text.secondary,
        },
        '& .MuiInputLabel-root.Mui-focused': {
          color: theme.palette.text.primary,
        },
      }}
    >
      <InputLabel id={`${name}-label`}>{label}</InputLabel>
      <Select
        labelId={`${name}-label`}
        name={name}
        value={value}
        onChange={onChange}
        label={label}
        {...props}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default CustomSelect;

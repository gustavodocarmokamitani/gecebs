import { TextField } from '@mui/material';
import { styled } from '@mui/system';

const StyledTextField = styled(TextField)(({ theme, type }) => ({
  '& input[type="date"]::-webkit-calendar-picker-indicator': {
    filter: type === 'date' ? 'invert(1)' : 'none',
  },
  '& input[type="date"]::-webkit-calendar-picker-indicator:hover': {
    cursor: 'pointer',
  },
}));

const CustomInput = ({ label, placeholder, type, ...rest }) => {
  return (
    <StyledTextField
      fullWidth
      variant="outlined"
      label={label}
      placeholder={placeholder}
      type={type}
      {...rest}
    />
  );
};

export default CustomInput;

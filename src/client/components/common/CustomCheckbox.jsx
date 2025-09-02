import { Checkbox } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCheckbox = styled(Checkbox)(({ theme }) => ({
  '& .MuiSvgIcon-root': {
    fontSize: '2rem',
  },
  '&.Mui-checked': {
    color: theme.palette.primary.main,
  },
  color: theme.palette.text.secondary,
}));

const CustomCheckbox = (props) => {
  return <StyledCheckbox {...props} />;
};

export default CustomCheckbox;

import { Button } from '@mui/material';
import { styled } from '@mui/system';

const StyledButton = styled(Button)(({ theme, color }) => {
  const buttonColor = theme.palette[color] || theme.palette.primary;

  return {
    height: 50,
    fontWeight: 600,
    backgroundColor: buttonColor.main,
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    '&:hover': {
      backgroundColor: buttonColor.dark,
      boxShadow: '0px 6px 8px rgba(0, 0, 0, 0.15)',
    },
    '&:active': {
      backgroundColor: buttonColor.light,
      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    },
  };
});

function CustomButton(props) {
  return <StyledButton {...props} />;
}

export default CustomButton;

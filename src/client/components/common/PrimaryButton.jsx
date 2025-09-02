import { Button } from '@mui/material';

const PrimaryButton = ({ children, ...rest }) => {
  return (
    <Button
      type="submit"
      fullWidth
      variant="contained"
      {...rest}
      sx={{ mt: 3, mb: 2, borderRadius: 3 }}
    >
      {children}
    </Button>
  );
};

export default PrimaryButton;

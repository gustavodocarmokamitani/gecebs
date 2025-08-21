import React from 'react';
import { Grid2 as Grid, TextField, Typography } from '@mui/material';

const CustomInput = ({ label, placeholder, ...rest }) => {
  return (
    <Grid size={12}>
      <TextField fullWidth variant="outlined" label={label} placeholder={placeholder} {...rest} />
    </Grid>
  );
};

export default CustomInput;

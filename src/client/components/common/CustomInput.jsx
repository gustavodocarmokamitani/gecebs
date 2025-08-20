import React from 'react';
import { Grid2 as Grid, TextField, Typography } from '@mui/material';

const CustomInput = ({ label, placeholder, ...rest }) => {
  return (
    <Grid size={12}>
      {/* Rótulo estático */}
      {/* <Typography variant="body2" sx={{ mb: 0.5 }}>
        {label}
      </Typography> */}

      {/* O componente TextField customizado */}
      <TextField fullWidth variant="outlined" label={label} placeholder={placeholder} {...rest} />
    </Grid>
  );
};

export default CustomInput;

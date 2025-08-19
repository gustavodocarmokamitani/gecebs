import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { useResponsive } from '../../hooks/useResponsive';

const AuthLayout = ({ title, children }) => {
  const deviceType = useResponsive();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: `${deviceType !== 'desktop' ? 'start' : 'center'}`,
        minHeight: '100vh',
        bgcolor: '#111317',
        px: 3,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 400,
          borderRadius: deviceType !== 'desktop' ? 0 : 5,
          pb: 20,
        }}
      >
        <Typography component="h1" variant="h5" align="center" gutterBottom marginBottom={5}>
          {title}
        </Typography>
        {children}
      </Paper>
    </Box>
  );
};

export default AuthLayout;

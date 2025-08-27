import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { useResponsive } from '../../hooks/useResponsive';
import backgroundAuth from '../../../assets/backgroundAuth.jpg';

const AuthLayout = ({ page, title, children }) => {
  const deviceType = useResponsive();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: `center`,
        minHeight: '100vh',
        bgcolor: '#111317',
        px: 3,
        backgroundImage: `url(${backgroundAuth})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 350,
          pb: 10,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.9)',
        }}
      >
        <Typography
          component="h1"
          variant="h5"
          align="center"
          gutterBottom
          color="primary"
          sx={{ fontWeight: 600, mb: 5 }}
        >
          <Box component="span" color="primary.dark" sx={{ fontWeight: 100 }}>
            {page}
          </Box>{' '}
          {title}
        </Typography>

        {children}
      </Paper>
    </Box>
  );
};

export default AuthLayout;

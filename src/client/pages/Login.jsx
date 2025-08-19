import React, { useState } from 'react';
import { TextField, Button, Grid2 as Grid, Link as MuiLink, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (event) => {
    event.preventDefault();
    console.log('Login attempt:', { email, password });
    // TODO: Adicionar lógica de autenticação aqui
  };

  return (
    <AuthLayout title="Entrar no Time">
      <form onSubmit={handleLogin}>
        <Grid container spacing={2}>
          <Grid size={12}>
            {/* Rótulo estático */}
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              E-mail do Time
            </Typography>
            <TextField
              required
              fullWidth
              id="email"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
              placeholder="Digite seu e-mail"
            />
          </Grid>
          <Grid size={12}>
            {/* Rótulo estático */}
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              Senha
            </Typography>
            <TextField
              required
              fullWidth
              name="password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
              placeholder="Digite sua senha"
            />
          </Grid>
          <Grid size={12}>
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Entrar
            </Button>
          </Grid>
          <Grid size={12} sx={{ textAlign: 'center' }}>
            <MuiLink component={RouterLink} to="/forgot-password" variant="body2">
              Esqueci a senha
            </MuiLink>
          </Grid>
          <Grid size={12} sx={{ textAlign: 'center' }}>
            <MuiLink component={RouterLink} to="/register" variant="body2">
              Não tem um time? Crie um novo.
            </MuiLink>
          </Grid>
        </Grid>
      </form>
    </AuthLayout>
  );
};

export default Login;

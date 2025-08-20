import React, { useState } from 'react';
import { Button, Grid2 as Grid, Link as MuiLink } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import CustomInput from '../components/common/CustomInput';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleLogin = (event) => {
    event.preventDefault();
    console.log('Login attempt:', formData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <AuthLayout page="Entrar no" title="Time">
      <form onSubmit={handleLogin}>
        <Grid container spacing={2}>
          <Grid size={12}>
            <CustomInput
              label="E-mail do Time"
              placeholder="exemplo@time.com"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid size={12}>
            <CustomInput
              label="Senha"
              placeholder="Digite sua senha"
              id="password"
              name="password"
              type="password" // 🔑 senha escondida
              required
              value={formData.password}
              onChange={handleInputChange}
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

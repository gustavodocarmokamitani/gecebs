import React, { useState } from 'react';
import { TextField, Button, Grid2 as Grid, Link as MuiLink, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import PrimaryButton from '../components/common/PrimaryButton';
import CustomInput from '../components/common/CustomInput';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    image: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = (event) => {
    event.preventDefault();
    console.log('Registering team:', formData);
    // TODO: Adicionar lógica para criar o time (chamada de API, etc.)
  };

  return (
    <AuthLayout title="Registrar Novo Time">
      <form onSubmit={handleRegister}>
        <Grid container spacing={2}>
          <Grid size={12}>
            <CustomInput
              label="Nome do Time"
              placeholder="Ex: Time Vencedor"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid size={12}>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              E-mail do Time
            </Typography>
            <TextField
              required
              fullWidth
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="exemplo@time.com"
            />
          </Grid>
          <Grid size={12}>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              Senha
            </Typography>
            <TextField
              required
              fullWidth
              name="password"
              type="password"
              id="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Mínimo de 8 caracteres"
            />
          </Grid>
          <Grid size={12}>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              Confimar Senha
            </Typography>
            <TextField
              required
              fullWidth
              name="password-confirm"
              type="password"
              id="password-confirm"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Mínimo de 8 caracteres"
            />
          </Grid>
          <Grid size={12}>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              Telefone (Opcional)
            </Typography>
            <TextField
              fullWidth
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="(00) 00000-0000"
            />
          </Grid>
          {/* <Grid size={12}>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              URL da Imagem/Logo (Opcional)
            </Typography>
            <TextField
              fullWidth
              id="image"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              placeholder="http://exemplo.com/logo.png"
            />
          </Grid> */}
          <Grid size={12}>
            <PrimaryButton>Registrar Time</PrimaryButton>
          </Grid>
          <Grid size={12} sx={{ textAlign: 'center' }}>
            <MuiLink component={RouterLink} to="/login" variant="body2">
              Já tem um time? Entre agora.
            </MuiLink>
          </Grid>
        </Grid>
      </form>
    </AuthLayout>
  );
};

export default Register;

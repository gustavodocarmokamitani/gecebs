import React, { useState } from 'react';
import { TextField, Button, Grid2 as Grid, Link as MuiLink, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import CustomButton from '../components/common/CustomButton';
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
    <AuthLayout page="Registre seu" title="Time">
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
            <CustomInput
              label="E-mail"
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
              placeholder="Mínimo de 8 caracteres"
              id="password"
              name="password"
              required
              value={formData.password}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid size={12}>
            <CustomInput
              label="Confirmar Senha"
              placeholder="Confirmar Senha"
              id="password-confirm"
              name="password-confirm"
              required
              value={formData.passwordConfirm}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid size={12}>
            <CustomInput
              label="Telefone"
              placeholder="(00) 00000-0000"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
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
            <CustomButton
              variant="contained"
              type="submit"
              fullWidth
              sx={{ mt: 3, mb: 2, borderRadius: 3 }}
            >
              Registrar Time
            </CustomButton>
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

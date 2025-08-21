import React, { useState, useEffect } from 'react';
import { Grid2 as Grid, Link as MuiLink, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import CustomButton from '../components/common/CustomButton';
import CustomInput from '../components/common/CustomInput';
import Auth from '../services/Auth';
import { toast } from 'react-toastify';
import usePhoneInput from '../hooks/usePhoneInput';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '', // Adicione esta propriedade ao estado
  });
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Use o hook para gerenciar o input de telefone
  const { phoneNumber, phoneError, handlePhoneChange } = usePhoneInput();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (formData.email) {
        try {
          const result = await Auth.checkEmailExists(formData.email);
          if (result.exists) {
            setEmailError('Este email já está em uso.');
          } else {
            setEmailError('');
          }
        } catch (err) {
          setEmailError('Não foi possível verificar o email.');
        }
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [formData.email]);

  const handleRegister = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    // Validação da confirmação de senha
    if (formData.password !== formData.passwordConfirm) {
      toast.error('As senhas não coincidem.');
      setIsLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('O formato do e-mail é inválido.');
      setIsLoading(false);
      return;
    }

    // Verificação final de erros antes de enviar
    if (emailError || phoneError) {
      toast.error('Corrija os erros do formulário antes de continuar.');
      setIsLoading(false);
      return;
    }

    try {
      // Envie os dados, incluindo o phoneNumber do hook
      const data = await Auth.registerTeam({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: phoneNumber, // Use o valor do hook aqui
      });

      toast.success(data.message);
      navigate('/login');
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao registrar. Tente novamente.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
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
              error={!!emailError}
              helperText={emailError}
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
              type={showPassword ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid size={12}>
            <CustomInput
              label="Confirmar Senha"
              placeholder="Confirmar Senha"
              id="password-confirm"
              name="passwordConfirm" // Corrigido para corresponder ao estado
              required
              value={formData.passwordConfirm} // Corrigido para corresponder ao estado
              onChange={handleInputChange}
              type={showPassword ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid size={12}>
            <CustomInput
              label="Telefone"
              placeholder="(00) 00000-0000"
              id="phone"
              name="phone"
              value={phoneNumber} // Use o valor do hook aqui
              onChange={handlePhoneChange} // Use a função do hook aqui
              disabled={isLoading}
              error={!!phoneError}
              helperText={phoneError}
            />
            {isLoading ? 'Registrando...' : ''}
          </Grid>
          <Grid size={12}>
            <CustomButton
              variant="contained"
              type="submit"
              fullWidth
              sx={{ mt: 3, mb: 2, borderRadius: 3 }}
              disabled={isLoading} // Desabilita o botão enquanto carrega
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

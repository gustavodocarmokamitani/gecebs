import { useState } from 'react';
import { Grid2 as Grid, Link as MuiLink, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../hooks/AuthContext';
import AuthLayout from '../components/auth/AuthLayout';
import CustomInput from '../components/common/CustomInput';
import CustomButton from '../components/common/CustomButton';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const { email, password } = formData;
      const success = await login({ loginId: email, password });

      if (success) {
        toast.success('Login realizado com sucesso!');
        navigate('/');
      }
    } catch (error) {
      console.error('Erro inesperado no login:', error);
    } finally {
      setIsLoading(false);
    }
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
              type={showPassword ? 'text' : 'password'}
              required
              value={formData.password}
              onChange={handleInputChange}
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
            <CustomButton
              variant="contained"
              type="submit"
              fullWidth
              sx={{ mt: 3, mb: 2, borderRadius: 3 }}
              disabled={isLoading}
            >
              {isLoading ? 'Entrando...' : 'Login'}{' '}
            </CustomButton>
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

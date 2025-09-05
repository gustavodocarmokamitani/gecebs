import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Divider,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  CircularProgress,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { toast } from 'react-toastify';
import { useResponsive } from '../hooks/useResponsive';
import Auth from '../services/Auth';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import usePhoneInput from '../hooks/usePhoneInput';
import CustomInput from '../components/common/CustomInput';
import CustomButton from '../components/common/CustomButton';
import CustomCheckbox from '../components/common/CustomCheckbox';
import ManagerService from '../services/Manager';
import CategoryService from '../services/Category';

const ManagerForm = () => {
  const { managerId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const deviceType = useResponsive();
  const isMobile = deviceType === 'mobile' || deviceType === 'tablet';

  const isEditing = !!managerId;

  const { phoneNumber, phoneError, handlePhoneChange } = usePhoneInput();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    categories: [],
  });

  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [phoneServerError, setPhoneServerError] = useState('');

  useEffect(() => {
    const fetchFormData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedCategories = await CategoryService.getAll();
        setCategories(fetchedCategories);

        if (isEditing) {
          const managerToEdit = await ManagerService.getById(managerId);
          if (managerToEdit) {
            const managerCategoriesIds = managerToEdit.categories?.map((c) => c.category.id) || [];
            const userPhone = managerToEdit.user.username;

            setFormData({
              firstName: managerToEdit.firstName,
              lastName: managerToEdit.lastName,
              categories: managerCategoriesIds,
            });
            handlePhoneChange({ target: { value: userPhone } });
          } else {
            setError('Manager não encontrado.');
            toast.error('Manager não encontrado.');
            navigate('/manager');
          }
        }
      } catch (err) {
        console.error('Erro ao buscar dados:', err);
        setError('Erro ao carregar dados. Tente novamente.');
        toast.error('Erro ao carregar dados.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchFormData();
  }, [managerId, isEditing, navigate, handlePhoneChange]);

  useEffect(() => {
    if (!isEditing) {
      setPhoneServerError('Verificando telefone...');
      const timeoutId = setTimeout(async () => {
        const phoneToVerify = phoneNumber.replace(/\D/g, '');

        if (phoneToVerify.length >= 11) {
          try {
            const result = await Auth.checkPhoneExists(phoneToVerify);
            if (result.exists) {
              setPhoneServerError('Este telefone já está em uso.');
            } else {
              setPhoneServerError('');
            }
          } catch (err) {
            setPhoneServerError('Não foi possível verificar o telefone.');
          }
        } else {
          setPhoneServerError('');
        }
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [phoneNumber, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const categoryId = parseInt(value);
      const newCategoryIds = checked
        ? [...prev.categories, categoryId]
        : prev.categories.filter((id) => id !== categoryId);
      return { ...prev, categories: newCategoryIds };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || formData.categories.length === 0) {
      toast.error('Por favor, preencha todos os campos obrigatórios e selecione uma categoria.');
      return;
    }

    if (!isEditing && (phoneError || phoneServerError)) {
      toast.error('Corrija os erros do telefone antes de continuar.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (isEditing) {
        const dataToSubmit = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          categories: formData.categories,
        };
        await ManagerService.update(managerId, dataToSubmit);
        toast.success('Manager atualizado com sucesso!');
      } else {
        const cleanedPhone = phoneNumber.replace(/\D/g, '');
        const dataToSubmit = {
          ...formData,
          phone: cleanedPhone,
        };
        await ManagerService.create(dataToSubmit);
        toast.success('Manager criado com sucesso!');
      }
      navigate('/manager');
    } catch (err) {
      console.error('Erro:', err);
      const errorMessage = err.response?.data?.message || 'Erro ao processar a solicitação.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const title = isEditing ? 'Editar Manager' : 'Adicionar Manager';

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? '' : 'center',
          gap: isMobile ? 2 : 0,
        }}
      >
        <Typography
          component="h6"
          variant="h6"
          gutterBottom
          color={theme.palette.text.secondary}
          sx={{
            fontWeight: 400,
            mt: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
          }}
        >
          <Box
            component="span"
            onClick={() => navigate('/manager')}
            sx={{
              cursor: 'pointer',
              '&:hover': {
                color: theme.palette.success.main,
              },
            }}
          >
            Visão Geral
          </Box>
          <span>
            <ChevronRightIcon sx={{ mt: 1.5 }} />
          </span>
          <Box component="span" color="primary.main" sx={{ fontWeight: 100 }}>
            {title}
          </Box>
        </Typography>
      </Box>
      <Divider sx={{ my: 2, borderColor: theme.palette.divider }} />
      <Typography sx={{ my: 3 }} variant="h6" color="textSecondary">
        Dados do Manager
      </Typography>
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            mr: isMobile ? 0 : 5,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Box sx={{ width: isMobile ? '100%' : 'calc(50% - 8px)' }}>
              <CustomInput
                label="Nome"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </Box>
            <Box sx={{ width: isMobile ? '100%' : 'calc(50% - 8px)' }}>
              <CustomInput
                label="Sobrenome"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </Box>
            <Box sx={{ width: '100%' }}>
              <CustomInput
                label="Telefone"
                name="phone"
                type="tel"
                value={phoneNumber}
                onChange={handlePhoneChange}
                required
                error={!!phoneError || !!phoneServerError}
                helperText={phoneError || phoneServerError}
                disabled={isEditing}
              />
            </Box>
          </Box>
          <FormControl component="fieldset" variant="standard" sx={{ mt: 2 }}>
            <FormLabel component="legend" sx={{ color: theme.palette.text.secondary }}>
              Categorias Gerenciadas*
            </FormLabel>
            <FormGroup row>
              {Array.isArray(categories) &&
                categories.map((category) => (
                  <FormControlLabel
                    key={category.id}
                    control={
                      <CustomCheckbox
                        checked={formData.categories.includes(category.id)}
                        onChange={handleCategoryChange}
                        value={category.id}
                      />
                    }
                    label={
                      <Typography color={theme.palette.text.secondary}>{category.name}</Typography>
                    }
                  />
                ))}
            </FormGroup>
          </FormControl>
          <Box sx={{ mt: 2 }}>
            <CustomButton
              fullWidth
              type="submit"
              variant="contained"
              disabled={isLoading || !!phoneError || !!phoneServerError}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Salvar'}
            </CustomButton>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ManagerForm;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Divider,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  CircularProgress,
} from '@mui/material';
import CustomInput from '../components/common/CustomInput';
import CustomButton from '../components/common/CustomButton';
import CustomCheckbox from '../components/common/CustomCheckbox';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useTheme } from '@mui/material/styles';
import { useResponsive } from '../hooks/useResponsive';
import ManagerService from '../services/Manager';
import CategoryService from '../services/Category';
import { toast } from 'react-toastify';

const ManagerForm = () => {
  const { managerId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const deviceType = useResponsive();
  const isMobile = deviceType === 'mobile' || deviceType === 'tablet';

  const isEditing = !!managerId;
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    categories: [],
  });
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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
            setFormData({
              firstName: managerToEdit.firstName,
              lastName: managerToEdit.lastName,
              phone: managerToEdit.phone,
              categories: managerToEdit.categories.map((c) => c.category.id),
            });
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
  }, [managerId, isEditing, navigate]);

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

    // Explicitly check for all required fields, including the category array.
    if (!formData.firstName || !formData.lastName || formData.categories.length === 0) {
      setError('Por favor, preencha todos os campos obrigatórios e selecione uma categoria.');
      toast.error('Por favor, preencha todos os campos obrigatórios e selecione uma categoria.');
      return; // Stop the function here
    }

    setIsLoading(true);
    setError(null);

    try {
      if (isEditing) {
        await ManagerService.update(managerId, formData);
        toast.success('Manager atualizado com sucesso!');
      } else {
        await ManagerService.create(formData);
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
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </Box>
          </Box>

          <FormControl component="fieldset" variant="standard" sx={{ mt: 2 }}>
            <FormLabel component="legend" sx={{ color: theme.palette.text.secondary }}>
              Categorias Gerenciadas
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
            <CustomButton fullWidth type="submit" variant="contained" disabled={isLoading}>
              {isLoading ? <CircularProgress size={24} /> : 'Salvar'}
            </CustomButton>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ManagerForm;

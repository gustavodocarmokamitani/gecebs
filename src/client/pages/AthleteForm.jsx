import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  CircularProgress,
  Divider,
  FormControl, // 👈 Adicionado
  FormLabel, // 👈 Adicionado
  FormGroup, // 👈 Adicionado
  FormControlLabel, // 👈 Adicionado
} from '@mui/material';
import CustomInput from '../components/common/CustomInput';
import CustomButton from '../components/common/CustomButton';
import CustomCheckbox from '../components/common/CustomCheckbox';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useTheme } from '@mui/material/styles';
import { useResponsive } from '../hooks/useResponsive';
import Athlete from '../services/Athlete';
import Category from '../services/Category';
import { toast } from 'react-toastify';
import usePhoneInput from '../hooks/usePhoneInput';
import Auth from '../services/Auth';

const AthleteForm = () => {
  const { athleteId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const deviceType = useResponsive();
  const isMobile = deviceType === 'mobile' || deviceType === 'tablet';

  const isEditing = !!athleteId;

  const { phoneNumber, phoneError, handlePhoneChange } = usePhoneInput();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    federationId: '',
    confederationId: '',
    birthDate: '',
    shirtNumber: '',
    categories: [],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [phoneServerError, setPhoneServerError] = useState('');
  const [availableCategories, setAvailableCategories] = useState([]);

  // Efeito para carregar categorias disponíveis e dados do atleta
  useEffect(() => {
    const fetchCategoriesAndAthlete = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const categoriesData = await Category.getAll();
        setAvailableCategories(categoriesData);

        if (isEditing) {
          const athleteToEdit = await Athlete.getById(athleteId);
          if (athleteToEdit) {
            setFormData({
              firstName: athleteToEdit.firstName,
              lastName: athleteToEdit.lastName,
              federationId: athleteToEdit.federationId,
              confederationId: athleteToEdit.confederationId,
              birthDate: athleteToEdit.birthDate.split('T')[0],
              shirtNumber: athleteToEdit.shirtNumber,
              categories: athleteToEdit.categories.map((cat) => cat.id),
            });
            handlePhoneChange({ target: { value: athleteToEdit.phone } });
          } else {
            setError('Atleta não encontrado.');
            toast.error('Atleta não encontrado.');
            navigate('/athlete');
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
    fetchCategoriesAndAthlete();
  }, [athleteId, isEditing, navigate, handlePhoneChange]);

  // Efeito para verificar se o telefone já existe
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (isEditing) {
        return;
      }
      const phoneToVerify = phoneNumber.replace(/\D/g, '');
      if (phoneToVerify.length >= 10) {
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
  }, [phoneNumber, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (categoryId) => {
    setFormData((prev) => {
      const isSelected = prev.categories.includes(categoryId);
      const newCategories = isSelected
        ? prev.categories.filter((id) => id !== categoryId)
        : [...prev.categories, categoryId];
      return { ...prev, categories: newCategories };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação do telefone
    if (phoneError || phoneServerError) {
      toast.error('Corrija os erros do telefone antes de continuar.');
      return;
    }

    // 🚀 Validação de categorias (o que você precisa adicionar)
    if (formData.categories.length === 0) {
      toast.error('Por favor, selecione pelo menos uma categoria.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const cleanedPhone = phoneNumber.replace(/\D/g, '');
    const dataToSubmit = {
      ...formData,
      phone: cleanedPhone,
      categories: formData.categories,
    };

    try {
      if (isEditing) {
        await Athlete.update(athleteId, dataToSubmit);
        toast.success('Atleta atualizado com sucesso!');
      } else {
        await Athlete.create(dataToSubmit);
        toast.success('Atleta criado com sucesso!');
      }
      navigate('/athlete');
    } catch (err) {
      console.error('Erro:', err);
      const errorMessage = err.response?.data?.message || 'Erro ao processar a solicitação.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const title = isEditing ? 'Editar Atleta' : 'Adicionar Atleta';

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
            onClick={() => navigate('/athlete')}
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
        Dados do Atleta
      </Typography>

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
          <Box sx={{ width: isMobile ? '100%' : 'calc(50% - 8px)' }}>
            <CustomInput
              label="Telefone"
              name="phone"
              type="tel"
              value={phoneNumber}
              onChange={handlePhoneChange}
              required
              disabled={isEditing}
              error={!!phoneError || !!phoneServerError}
              helperText={phoneError || phoneServerError}
            />
          </Box>
          <Box sx={{ width: isMobile ? '100%' : 'calc(50% - 8px)' }}>
            <CustomInput
              label="Data de Nascimento"
              name="birthDate"
              type="date"
              required
              value={formData.birthDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
          <Box sx={{ width: isMobile ? '100%' : 'calc(50% - 8px)' }}>
            <CustomInput
              label="Nº da Federação"
              name="federationId"
              value={formData.federationId}
              onChange={handleChange}
            />
          </Box>
          <Box sx={{ width: isMobile ? '100%' : 'calc(50% - 8px)' }}>
            <CustomInput
              label="Nº da Confederação"
              name="confederationId"
              value={formData.confederationId}
              onChange={handleChange}
            />
          </Box>
          <Box sx={{ width: isMobile ? '100%' : 'calc(50% - 8px)' }}>
            <CustomInput
              label="Nº da Camisa"
              name="shirtNumber"
              type="number"
              value={formData.shirtNumber}
              onChange={handleChange}
            />
          </Box>
        </Box>

        {/* 🚀 Seção de Checkbox para Categorias */}
        <FormControl component="fieldset" variant="standard" sx={{ mt: 2 }}>
          <FormLabel component="legend" sx={{ color: theme.palette.text.secondary }}>
            Categorias
          </FormLabel>
          <FormGroup row>
            {Array.isArray(availableCategories) && availableCategories.length > 0 ? (
              availableCategories.map((category) => (
                <FormControlLabel
                  key={category.id}
                  control={
                    <CustomCheckbox
                      checked={formData.categories.includes(category.id)}
                      onChange={() => handleCategoryChange(category.id)}
                    />
                  }
                  label={
                    <Typography color={theme.palette.text.secondary}>{category.name}</Typography>
                  }
                />
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                Nenhuma categoria disponível.
              </Typography>
            )}
          </FormGroup>
        </FormControl>
        {/* Fim da Seção de Checkbox */}

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
    </Box>
  );
};

export default AthleteForm;

// src/pages/AthleteForm.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, IconButton, Divider } from '@mui/material';
import CustomInput from '../components/common/CustomInput';
import CustomButton from '../components/common/CustomButton';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useTheme } from '@mui/material/styles';
import { useResponsive } from '../hooks/useResponsive';
import Athlete from '../services/Athlete';
import { toast } from 'react-toastify';

const atletas = [
  // ... seus dados de exemplo
];

const AthleteForm = () => {
  const { athleteId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const deviceType = useResponsive();
  const isMobile = deviceType === 'mobile' || deviceType === 'tablet';

  const isEditing = !!athleteId;
  const athleteToEdit = isEditing ? atletas.find((a) => a.id === parseInt(athleteId)) : null;

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    federationId: '',
    confederationId: '',
    birthDate: '',
    shirtNumber: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditing && athleteToEdit) {
      setFormData({
        firstName: athleteToEdit.firstName,
        lastName: athleteToEdit.lastName,
        phone: athleteToEdit.phone,
        federationId: athleteToEdit.federationId,
        confederationId: athleteToEdit.confederationId,
        birthDate: athleteToEdit.birthDate.split('T')[0],
        shirtNumber: athleteToEdit.shirtNumber,
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        phone: '',
        federationId: '',
        confederationId: '',
        birthDate: '',
        shirtNumber: '',
      });
    }
  }, [athleteId, isEditing, athleteToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isEditing) {
        toast.info('Funcionalidade de edição ainda não implementada.');
      } else {
        // Lógica de CRIAÇÃO
        const newAthlete = await Athlete.create(formData);
        toast.success('Atleta criado com sucesso!');
        console.log('Atleta criado:', newAthlete);
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
  const subtitle = isEditing
    ? athleteToEdit?.firstName + ' ' + athleteToEdit?.lastName
    : 'Novo Atleta';

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
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </Box>
          <Box sx={{ width: isMobile ? '100%' : 'calc(50% - 8px)' }}>
            <CustomInput
              label="Data de Nascimento"
              name="birthDate"
              type="date"
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

        <Box sx={{ mt: 2 }}>
          <CustomButton fullWidth type="submit" variant="contained" disabled={isLoading}>
            {isLoading ? 'Salvando...' : 'Salvar'}
          </CustomButton>
        </Box>
      </Box>
    </Box>
  );
};

export default AthleteForm;

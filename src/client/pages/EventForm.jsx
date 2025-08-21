// src/pages/EventForm.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Divider, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import CustomInput from '../components/common/CustomInput';
import CustomButton from '../components/common/CustomButton';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useTheme } from '@mui/material/styles';
import { useResponsive } from '../hooks/useResponsive';
// Importe o serviço de eventos
import EventService from '../services/Event'; // O nome do arquivo pode variar (ex: Event.js)

// Dados de exemplo para simular a tabela de categorias e tipos de evento
const eventTypes = [
  { value: 'TRAINING', label: 'Treinamento' },
  { value: 'CHAMPIONSHIP', label: 'Campeonato' },
];

const categories = [
  { id: 1, name: 'Adulto' },
  { id: 2, name: 'Sub-23' },
  { id: 3, name: 'Juvenil' },
  { id: 4, name: 'Junior' },
  { id: 5, name: 'Pré-Junior' },
  { id: 6, name: 'Infantil' },
  { id: 7, name: 'Pré-Infantil' },
  { id: 8, name: 'T-Bol' },
];

// Dados de exemplo para simular edição
const eventos = [
  {
    id: 1,
    name: 'Campeonato Nacional de Karatê',
    date: '2025-11-15T00:00:00.000Z',
    location: 'Ginásio do Ibirapuera, São Paulo - SP',
    type: 'CHAMPIONSHIP',
    categoryId: 1,
  },
  {
    id: 2,
    name: 'Treinamento de Verão - Dojo Central',
    date: '2026-01-20T00:00:00.000Z',
    location: 'Dojo Central da Federação',
    type: 'TRAINING',
    categoryId: 2,
  },
];

const EventForm = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const deviceType = useResponsive();
  const isMobile = deviceType === 'mobile' || deviceType === 'tablet';

  const isEditing = !!eventId;
  const eventToEdit = isEditing ? eventos.find((e) => e.id === parseInt(eventId)) : null;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    location: '',
    type: '',
    categoryId: '',
  });

  useEffect(() => {
    if (isEditing && eventToEdit) {
      setFormData({
        name: eventToEdit.name,
        description: eventToEdit.description || '',
        date: eventToEdit.date.split('T')[0],
        location: eventToEdit.location || '',
        type: eventToEdit.type,
        categoryId: eventToEdit.categoryId,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        date: '',
        location: '',
        type: '',
        categoryId: '',
      });
    }
  }, [eventId, isEditing, eventToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        // Lógica de edição
        console.log('Dados para edição:', formData);
        // await EventService.update(eventId, formData); // Chamada para o serviço de edição
      } else {
        // Lógica de criação
        console.log('Dados para criação:', formData);
        await EventService.create(formData); // Chamada para o serviço de criação
        console.log('Evento criado com sucesso!');
      }
      navigate('/event');
    } catch (error) {
      console.error('Erro ao salvar o evento:', error);
      // Aqui você pode adicionar um feedback ao usuário (e.g., um alerta ou snackbar)
    }
  };

  const title = isEditing ? 'Editar Evento' : 'Adicionar Evento';

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
            onClick={() => navigate('/event')}
            sx={{
              cursor: 'pointer',
              '&:hover': {
                color: theme.palette.primary.main,
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
        Dados do Evento
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
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {/* Nome do Evento */}
          <Box sx={{ width: isMobile ? '100%' : 'calc(50% - 8px)' }}>
            <CustomInput
              label="Nome do Evento"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Box>
          {/* Data */}
          <Box sx={{ width: isMobile ? '100%' : 'calc(50% - 8px)' }}>
            <CustomInput
              label="Data"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Box>
          {/* Local */}
          <Box sx={{ width: isMobile ? '100%' : 'calc(50% - 8px)' }}>
            <CustomInput
              label="Local"
              name="location"
              value={formData.location}
              onChange={handleChange}
            />
          </Box>
          {/* Tipo do Evento (TRAINING ou CHAMPIONSHIP) */}
          <Box sx={{ width: isMobile ? '100%' : 'calc(50% - 8px)' }}>
            <FormControl fullWidth>
              <InputLabel id="type-label">Tipo do Evento</InputLabel>
              <Select
                labelId="type-label"
                name="type"
                value={formData.type}
                label="Tipo do Evento"
                onChange={handleChange}
                required
              >
                {eventTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          {/* Categoria do Evento (usando o ID) */}
          <Box sx={{ width: isMobile ? '100%' : 'calc(50% - 8px)' }}>
            <FormControl fullWidth>
              <InputLabel id="category-label">Categoria</InputLabel>
              <Select
                labelId="category-label"
                name="categoryId"
                value={formData.categoryId}
                label="Categoria"
                onChange={handleChange}
                required
              >
                {categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          {/* Descrição */}
          <Box sx={{ width: isMobile ? '100%' : 'calc(50% - 8px)' }}>
            <CustomInput
              label="Descrição"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </Box>
        </Box>
        <Box sx={{ mt: 2 }}>
          <CustomButton fullWidth type="submit" variant="contained">
            Salvar
          </CustomButton>
        </Box>
      </Box>
    </Box>
  );
};

export default EventForm;

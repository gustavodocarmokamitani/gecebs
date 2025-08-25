import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import CustomInput from '../components/common/CustomInput';
import CustomButton from '../components/common/CustomButton';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useTheme } from '@mui/material/styles';
import { useResponsive } from '../hooks/useResponsive';
import EventService from '../services/Event';
import CategoryService from '../services/Category';
import { toast } from 'react-toastify';

// Dados que não mudam e podem ficar aqui
const eventTypes = [
  { value: 'Treinamento', label: 'Treinamento' },
  { value: 'Campeonato', label: 'Campeonato' },
  { value: 'Outros', label: 'Outros' },
];

const EventForm = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const deviceType = useResponsive();
  const isMobile = deviceType === 'mobile' || deviceType === 'tablet';

  const isEditing = !!eventId;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    location: '',
    type: '',
    categoryId: '',
  });

  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Função para buscar as categorias do backend
  const fetchCategories = async () => {
    try {
      const fetchedCategories = await CategoryService.getAll();
      setCategories(fetchedCategories);
      console.log(fetchedCategories);
    } catch (err) {
      console.error('Erro ao buscar categorias:', err);
      toast.error('Erro ao carregar as categorias.');
    }
  };

  // Função para buscar os dados do evento para edição
  const fetchEventData = async () => {
    setIsLoading(true);
    try {
      const fetchedEvent = await EventService.getById(eventId);
      if (fetchedEvent) {
        setFormData({
          name: fetchedEvent.name,
          description: fetchedEvent.description || '',
          date: new Date(fetchedEvent.date).toISOString().split('T')[0],
          location: fetchedEvent.location || '',
          type: fetchedEvent.type,
          categoryId: fetchedEvent.categoryId,
        });
      }
    } catch (err) {
      console.error('Erro ao buscar evento:', err);
      toast.error('Erro ao carregar os dados do evento para edição.');
      navigate('/event'); // Redireciona em caso de erro
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    if (isEditing) {
      fetchEventData();
    }
  }, [isEditing, eventId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isEditing) {
        await EventService.update(eventId, formData);
        toast.success('Evento atualizado com sucesso!');
      } else {
        await EventService.create(formData);
        toast.success('Evento criado com sucesso!');
      }
      navigate('/event');
    } catch (error) {
      console.error('Erro ao salvar o evento:', error);
      toast.error(`Erro ao salvar o evento: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const title = isEditing ? 'Editar Evento' : 'Adicionar Evento';

  // Renderiza um spinner enquanto os dados estão sendo buscados
  if (isLoading && isEditing) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

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
                {Array.isArray(categories) &&
                  categories.map((cat) => (
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
          <CustomButton fullWidth type="submit" variant="contained" disabled={isLoading}>
            {isLoading ? <CircularProgress size={24} /> : 'Salvar'}
          </CustomButton>
        </Box>
      </Box>
    </Box>
  );
};

export default EventForm;

// src/pages/PaymentForm.jsx
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
import CustomSelect from '../components/common/CustomSelect';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useTheme } from '@mui/material/styles';
import { useResponsive } from '../hooks/useResponsive';
import PaymentService from '../services/Payment';
import CategoryService from '../services/Category';
import EventService from '../services/Event';
import { toast } from 'react-toastify';

const PaymentForm = () => {
  const { paymentId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const deviceType = useResponsive();
  const isMobile = deviceType === 'mobile' || deviceType === 'tablet';

  const isEditing = !!paymentId;
  const [formData, setFormData] = useState({
    name: '',
    dueDate: '',
    pixKey: '',
    categoryId: '',
    eventId: '',
  });

  const [categories, setCategories] = useState([]);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [error, setError] = useState(null);

  // Função unificada para buscar dados iniciais (categorias e eventos)
  const fetchInitialData = async () => {
    setIsDataLoading(true);
    try {
      const [fetchedCategories, fetchedEvents] = await Promise.all([
        CategoryService.getAll(),
        EventService.listAllTeamEvents(),
      ]);
      setCategories(fetchedCategories);
      setEvents(fetchedEvents);

      if (isEditing) {
        // Agora, a resposta da API terá o objeto `event`
        const paymentToEdit = await PaymentService.getById(paymentId);
        console.log(paymentToEdit);

        if (paymentToEdit) {
          setFormData({
            name: paymentToEdit.name,
            dueDate: new Date(paymentToEdit.dueDate).toISOString().split('T')[0],
            pixKey: paymentToEdit.pixKey,
            categoryId: paymentToEdit.categoryId,
            // ATUALIZAÇÃO AQUI: Apenas use o eventId diretamente
            eventId: paymentToEdit.eventId || '',
          });
        }
      }
    } catch (err) {
      console.error('Erro ao buscar dados iniciais:', err);
      toast.error('Erro ao carregar as opções de categorias e eventos.');
      setError('Erro ao carregar dados. Tente recarregar a página.');
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, [isEditing, paymentId]);

  // NOVO useEffect para preencher o nome do pagamento com o nome do evento
  useEffect(() => {
    const selectedEvent = events.find((event) => String(event.id) === String(formData.eventId));

    // Apenas preenche o nome se um evento for selecionado e se o formulário NÃO estiver em edição
    // ou se o nome atual for diferente do nome do evento. Isso evita sobrescrever um nome editado.
    if (selectedEvent && (!isEditing || selectedEvent.name !== formData.name)) {
      setFormData((prev) => ({
        ...prev,
        name: selectedEvent.name,
      }));
    } else if (!formData.eventId) {
      // Se nenhum evento for selecionado, permite que o nome seja editável
      // Apenas limpa o nome se ele for o nome de um evento antigo
      const eventNameFromId = events.find(
        (event) => String(event.id) === String(formData.eventId)
      )?.name;
      if (formData.name === eventNameFromId) {
        setFormData((prev) => ({
          ...prev,
          name: '',
        }));
      }
    }
  }, [formData.eventId, events, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const dataToSubmit = {
      name: formData.name,
      dueDate: formData.dueDate,
      pixKey: formData.pixKey,
      categoryId: formData.categoryId,
      eventId: formData.eventId || null,
    };

    try {
      if (isEditing) {
        await PaymentService.update(paymentId, dataToSubmit);
        toast.success('Pagamento atualizado com sucesso!');
        navigate(`/payment/items/${paymentId}`);
      } else {
        const newPayment = await PaymentService.create(dataToSubmit);
        toast.success('Pagamento criado com sucesso! Agora adicione os itens.');
        navigate(`/payment/items/${newPayment.id}`);
      }
    } catch (err) {
      console.error('Erro ao salvar pagamento:', err);
      toast.error(`Erro ao salvar o pagamento: ${err.response?.data?.message || err.message}`);
      setError(`Erro: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const title = isEditing ? 'Editar Despesa' : 'Adicionar Despesa';
  const buttonText = isLoading ? 'Salvando...' : isEditing ? 'Salvar' : 'Avançar';
  const isNameDisabled = !!formData.eventId && !isEditing;

  if (isDataLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const eventOptions = [
    { value: '', label: 'Nenhum' },
    ...events.map((e) => ({ value: e.id, label: e.name })),
  ];

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
            onClick={() => navigate('/payment')}
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
        Dados do Pagamento
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
          {/* Campo Evento Associado - MOVIDO PARA O TOPO */}
          <Box sx={{ width: isMobile ? '100%' : 'calc(50% - 8px)' }}>
            <CustomSelect
              label="Evento Associado"
              name="eventId"
              value={formData.eventId}
              onChange={handleChange}
              options={eventOptions}
            />
          </Box>
          {/* Nome do Pagamento */}
          <Box sx={{ width: isMobile ? '100%' : 'calc(50% - 8px)' }}>
            <CustomInput
              label="Nome do Pagamento"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={isNameDisabled}
            />
          </Box>
          {/* Data de Vencimento */}
          <Box sx={{ width: isMobile ? '100%' : 'calc(50% - 8px)' }}>
            <CustomInput
              label="Data de Vencimento"
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Box>
          {/* Chave Pix */}
          <Box sx={{ width: isMobile ? '100%' : 'calc(50% - 8px)' }}>
            <CustomInput
              label="Chave Pix"
              name="pixKey"
              value={formData.pixKey}
              onChange={handleChange}
            />
          </Box>
          {/* Categoria do Pagamento (usando o ID) */}
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
        </Box>
        <Box sx={{ mt: 2 }}>
          {error && (
            <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>
              {error}
            </Typography>
          )}
          <CustomButton fullWidth type="submit" variant="contained" disabled={isLoading}>
            {buttonText}
          </CustomButton>
        </Box>
      </Box>
    </Box>
  );
};

export default PaymentForm;

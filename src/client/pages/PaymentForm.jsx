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
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import CustomInput from '../components/common/CustomInput';
import CustomButton from '../components/common/CustomButton';
import CustomSelect from '../components/common/CustomSelect';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useTheme } from '@mui/material/styles';
import { useResponsive } from '../hooks/useResponsive';
import PaymentService from '../services/Payment';

// Dados de exemplo para simular a tabela de categorias e eventos
const categories = [
  { id: 1, name: 'Adulto' },
  { id: 2, name: 'Sub-23' },
  // ... outras categorias
];

const eventos = [
  { id: 1, name: 'Campeonato Nacional de Karatê' },
  { id: 2, name: 'Treinamento de Verão' },
  // ... outros eventos
];

// Dados de exemplo para simular edição (se precisar)
const payments = [
  {
    id: 1,
    name: 'Taxa de Inscrição - Campeonato',
    value: 150.0,
    dueDate: '2025-10-31T00:00:00.000Z',
    pixKey: '123.456.789-01',
    categoryId: 1,
    eventId: 1, // Exemplo de pagamento associado a um evento
  },
  {
    id: 2,
    name: 'Mensalidade Outubro',
    value: 100.0,
    dueDate: '2025-10-05T00:00:00.000Z',
    pixKey: '987.654.321-01',
    categoryId: 2,
    eventId: null, // Exemplo de pagamento sem evento associado
  },
];

const PaymentForm = () => {
  const { paymentId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const deviceType = useResponsive();
  const isMobile = deviceType === 'mobile' || deviceType === 'tablet';

  const isEditing = !!paymentId;
  const paymentToEdit = isEditing ? payments.find((p) => p.id === parseInt(paymentId)) : null;

  const [formData, setFormData] = useState({
    name: '',
    dueDate: '',
    pixKey: '',
    categoryId: '',
    eventId: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditing && paymentToEdit) {
      setFormData({
        name: paymentToEdit.name,
        dueDate: paymentToEdit.dueDate.split('T')[0],
        pixKey: paymentToEdit.pixKey,
        categoryId: paymentToEdit.categoryId,
        eventId: paymentToEdit.eventId || '',
      });
    } else {
      setFormData({
        name: '',
        dueDate: '',
        pixKey: '',
        categoryId: '',
        eventId: '',
      });
    }
  }, [paymentId, isEditing, paymentToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // O valor não é mais enviado do frontend, ele será calculado no backend
    const dataToSubmit = {
      name: formData.name,
      dueDate: formData.dueDate,
      pixKey: formData.pixKey,
      categoryId: formData.categoryId,
      eventId: formData.eventId ? parseInt(formData.eventId) : null,
    };

    try {
      if (isEditing) {
        console.log('Dados para edição:', dataToSubmit);
      } else {
        const newPayment = await PaymentService.create(dataToSubmit);
        console.log('Pagamento criado com sucesso!');
        // Navega para a página de itens, passando o ID do novo pagamento
        navigate(`/payment/items/${newPayment.id}`);
      }
    } catch (err) {
      console.error('Erro:', err);
      setError('Erro ao salvar o pagamento. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const title = isEditing ? 'Editar Despesas' : 'Adicionar Despesas';
  const buttonText = isLoading ? 'Salvando...' : 'Avançar';

  const eventOptions = [
    { value: '', label: 'Nenhum' },
    ...eventos.map((e) => ({ value: e.id, label: e.name })),
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
          {/* Nome do Pagamento */}
          <Box sx={{ width: isMobile ? '100%' : 'calc(50% - 8px)' }}>
            <CustomInput
              label="Nome do Pagamento"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Box>
          {/* O campo de valor foi removido */}

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
          {/* Novo campo: Evento */}
          <Box sx={{ width: isMobile ? '100%' : 'calc(50% - 8px)' }}>
            <CustomSelect
              label="Evento Associado"
              name="eventId"
              value={formData.eventId}
              onChange={handleChange}
              options={eventOptions}
            />
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

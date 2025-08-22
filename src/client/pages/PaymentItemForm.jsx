import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Divider,
  Paper,
  IconButton,
  List,
  ListItem,
  ListItemText,
  FormControlLabel,
  Checkbox,
  Tooltip,
} from '@mui/material';
import CustomInput from '../components/common/CustomInput';
import CustomButton from '../components/common/CustomButton';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme } from '@mui/material/styles';
import { useResponsive } from '../hooks/useResponsive';
import PaymentService from '../services/Payment';

const PaymentItemForm = () => {
  const { paymentId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const deviceType = useResponsive();
  const isMobile = deviceType === 'mobile' || deviceType === 'tablet';

  const [payment, setPayment] = useState(null);
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    value: '',
    quantityEnabled: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState(null);

  // Estado para controlar a ação do botão de conclusão
  const [isSavingAll, setIsSavingAll] = useState(false);

  useEffect(() => {
    const fetchPaymentAndItems = async () => {
      setIsLoading(true);
      try {
        // Assume que a rota de getById já retorna os itens
        const fetchedPayment = await PaymentService.getById(parseInt(paymentId));
        setPayment(fetchedPayment);
        // Garante que items é sempre um array
        setItems(fetchedPayment.items || []);
        setError(null);
      } catch (err) {
        console.error('Erro ao buscar pagamento e itens:', err);
        setError('Erro ao carregar os dados do pagamento.');
      } finally {
        setIsLoading(false);
      }
    };
    if (paymentId) {
      fetchPaymentAndItems();
    }
  }, [paymentId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    setIsAdding(true);
    setError(null);

    const itemValue = parseFloat(formData.value);
    if (isNaN(itemValue)) {
      setError('O valor do item deve ser um número válido.');
      setIsAdding(false);
      return;
    }

    // Adiciona o item ao estado local, sem fazer requisição
    const newItem = {
      // O id temporário é para o React poder rastrear o item na lista
      id: Date.now(),
      name: formData.name,
      value: itemValue,
      quantityEnabled: formData.quantityEnabled,
    };
    setItems((prevItems) => [...prevItems, newItem]);
    setFormData({ name: '', value: '', quantityEnabled: false }); // Limpa o formulário

    setIsAdding(false);
  };

  const handleDeleteItem = (itemId) => {
    // Apenas remove do estado local
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    // Observação: para um app completo, você precisaria de uma rota DELETE no backend
    // e chamar o serviço aqui para sincronizar.
  };

  const handleSaveAndFinish = async () => {
    setIsSavingAll(true);
    setError(null);
    try {
      // Mapeia os itens do estado e envia um POST para cada um
      const savePromises = items.map((item) => PaymentService.addItem(parseInt(paymentId), item));

      // Usa Promise.all para executar todas as requisições em paralelo
      await Promise.all(savePromises);

      navigate('/payment');
    } catch (err) {
      console.error('Erro ao salvar os itens:', err);
      setError('Erro ao salvar os itens. Verifique sua conexão.');
    } finally {
      setIsSavingAll(false);
    }
  };

  const totalValue = items
    .reduce((sum, item) => sum + (typeof item.value === 'number' ? item.value : 0), 0)
    .toFixed(2);

  if (isLoading) {
    return <Typography>Carregando...</Typography>;
  }

  return (
    <Box>
      <Typography
        component="h6"
        variant="h6"
        gutterBottom
        color="textSecondary"
        sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
      >
        <Box component="span" color="textSecondary" sx={{ fontWeight: 100 }}>
          Visão Geral
        </Box>
        <span>
          <ChevronRightIcon sx={{ mt: 1.5 }} />
        </span>
        <Box component="span" color="primary.main">
          {payment ? `Adicionar Itens` : 'Carregando...'}
        </Box>
      </Typography>
      <Divider sx={{ my: 2, borderColor: theme.palette.divider }} />

      <Typography variant="h6" color="textSecondary" sx={{ mb: 2 }}>
        Adicionar Novo Item
      </Typography>
      <Box
        component="form"
        onSubmit={handleAddItem}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}
      >
        <CustomInput
          label="Nome do Item"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <CustomInput
          label="Valor do Item (R$)"
          name="value"
          type="number"
          value={formData.value}
          onChange={handleChange}
          required
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.quantityEnabled}
              onChange={handleChange}
              name="quantityEnabled"
              color="primary"
            />
          }
          label="Permitir quantidade múltipla?"
          sx={{ color: theme.palette.text.secondary }}
        />
        <CustomButton type="submit" variant="contained" disabled={isAdding}>
          {isAdding ? 'Adicionando...' : 'Adicionar Item'}
        </CustomButton>
      </Box>

      <Typography variant="h6" color="textSecondary" sx={{ mb: 2 }}>
        Itens Adicionados ({items.length}) - Total: R$ {totalValue}
      </Typography>

      {error && (
        <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>
          {error}
        </Typography>
      )}

      {items.length === 0 ? (
        <Typography color="text.secondary">
          Nenhum item adicionado a este pagamento ainda.
        </Typography>
      ) : (
        <Paper elevation={1} sx={{ p: 2, bgcolor: theme.palette.background.paper }}>
          <List>
            {items.map((item) => (
              <ListItem key={item.id} divider sx={{ pr: 6 }}>
                <ListItemText
                  primary={item.name}
                  secondary={`R$ ${item.value?.toFixed(2) || '0.00'} - ${item.quantityEnabled ? 'Permite Qtd.' : 'Qtd. única'}`}
                />
                <Tooltip title="Deletar Item">
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDeleteItem(item.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      <Box sx={{ mt: 4 }}>
        <CustomButton
          fullWidth
          variant="contained"
          onClick={handleSaveAndFinish}
          disabled={isSavingAll}
        >
          {isSavingAll ? 'Salvando...' : 'Concluir'}
        </CustomButton>
      </Box>
    </Box>
  );
};

export default PaymentItemForm;

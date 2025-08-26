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
  CircularProgress,
} from '@mui/material';
import CustomInput from '../components/common/CustomInput';
import CustomButton from '../components/common/CustomButton';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useTheme } from '@mui/material/styles';
import { useResponsive } from '../hooks/useResponsive';
import PaymentService from '../services/Payment';
import { toast } from 'react-toastify';

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
  const [editingItem, setEditingItem] = useState(null);

  // Função para buscar o pagamento e seus itens
  const fetchPaymentAndItems = async () => {
    setIsLoading(true);
    try {
      const fetchedPayment = await PaymentService.getById(parseInt(paymentId));
      setPayment(fetchedPayment);
      setItems(fetchedPayment.items || []);
      setError(null);
    } catch (err) {
      console.error('Erro ao buscar pagamento e itens:', err);
      toast.error('Erro ao carregar os dados do pagamento.');
      setError('Erro ao carregar os dados do pagamento.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
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

  const handleAddItem = async (e) => {
    e.preventDefault();
    setIsAdding(true);
    setError(null);

    const itemValue = parseFloat(formData.value);
    if (isNaN(itemValue)) {
      setError('O valor do item deve ser um número válido.');
      setIsAdding(false);
      return;
    }

    try {
      const dataToSubmit = {
        name: formData.name,
        value: itemValue,
        quantityEnabled: formData.quantityEnabled,
      };

      if (editingItem) {
        // Lógica de EDIÇÃO
        await PaymentService.updateItem(editingItem.id, dataToSubmit);
        toast.success('Item atualizado com sucesso!');
      } else {
        // Lógica de ADIÇÃO
        await PaymentService.addItem(parseInt(paymentId), dataToSubmit);
        toast.success('Item adicionado com sucesso!');
      }

      // Após a operação de sucesso, recarrega todos os dados do pagamento
      // Isso é crucial para que o valor total seja atualizado na tela
      await fetchPaymentAndItems();

      setFormData({ name: '', value: '', quantityEnabled: false });
      setEditingItem(null); // Limpa o estado de edição
    } catch (err) {
      console.error('Erro ao salvar o item:', err);
      toast.error(`Erro ao salvar o item: ${err.response?.data?.message || err.message}`);
      setError(`Erro: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsAdding(false);
    }
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      value: item.value,
      quantityEnabled: item.quantityEnabled,
    });
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await PaymentService.deleteItem(itemId);
      toast.success('Item removido com sucesso!');

      // Após a exclusão, recarrega todos os dados do pagamento para sincronizar o total
      await fetchPaymentAndItems();
    } catch (err) {
      console.error('Erro ao deletar o item:', err);
      toast.error('Erro ao remover o item. Tente novamente.');
      setError(`Erro: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleSaveAndFinish = () => {
    navigate('/payment');
  };

  const totalValue = items
    .reduce((sum, item) => sum + (typeof item.value === 'number' ? item.value : 0), 0)
    .toFixed(2);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
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
        <Box
          component="span"
          color="textSecondary"
          sx={{ fontWeight: 100 }}
          onClick={() => navigate('/payment')}
        >
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
        {editingItem ? 'Editar Item' : 'Adicionar Novo Item'}
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
          {isAdding ? 'Salvando...' : editingItem ? 'Salvar Edição' : 'Adicionar Item'}
        </CustomButton>
        {editingItem && (
          <CustomButton
            variant="contained"
            onClick={() => {
              setEditingItem(null);
              setFormData({ name: '', value: '', quantityEnabled: false });
            }}
          >
            Cancelar Edição
          </CustomButton>
        )}
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
                <Tooltip title="Editar Item">
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => handleEditItem(item)}
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
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
          disabled={!items.length}
        >
          Concluir
        </CustomButton>
      </Box>
    </Box>
  );
};

export default PaymentItemForm;

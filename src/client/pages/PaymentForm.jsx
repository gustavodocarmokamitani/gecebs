// src/pages/PaymentForm.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Divider,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import CustomInput from '../components/common/CustomInput';
import CustomButton from '../components/common/CustomButton';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useTheme } from '@mui/material/styles';
import { useResponsive } from '../hooks/useResponsive';

// Dados de exemplo para simular edição
const pagamentos = [
  // ... seus dados de exemplo (os mesmos do Payment.jsx)
];

const categoryLabels = {
  1: 'Adulto',
  2: 'Sub-23',
  3: 'Juvenil',
  // ... outras categorias
};

const PaymentForm = () => {
  const { paymentId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const deviceType = useResponsive();
  const isMobile = deviceType === 'mobile' || deviceType === 'tablet';

  const isEditing = !!paymentId;
  const paymentToEdit = isEditing ? pagamentos.find((p) => p.id === parseInt(paymentId)) : null;

  const [formData, setFormData] = useState({
    name: '',
    value: '',
    dueDate: '',
    pixKey: '',
    categoryId: '',
  });

  useEffect(() => {
    if (isEditing && paymentToEdit) {
      setFormData({
        name: paymentToEdit.name,
        value: paymentToEdit.value,
        dueDate: paymentToEdit.dueDate.split('T')[0],
        pixKey: paymentToEdit.pixKey,
        categoryId: paymentToEdit.categoryId,
      });
    } else {
      setFormData({
        name: '',
        value: '',
        dueDate: '',
        pixKey: '',
        categoryId: '',
      });
    }
  }, [paymentId, isEditing, paymentToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      console.log('Dados para edição:', formData);
    } else {
      console.log('Dados para criação:', formData);
    }
    navigate('/payment');
  };

  const title = isEditing ? 'Editar Pagamento' : 'Adicionar Pagamento';

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
          <Box sx={{ width: isMobile ? '100%' : 'calc(50% - 8px)' }}>
            <CustomInput
              label="Nome do Pagamento"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Box>
          <Box sx={{ width: isMobile ? '100%' : 'calc(50% - 8px)' }}>
            <CustomInput
              label="Valor (R$)"
              name="value"
              type="number"
              value={formData.value}
              onChange={handleChange}
              required
            />
          </Box>
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
          <Box sx={{ width: isMobile ? '100%' : 'calc(50% - 8px)' }}>
            <CustomInput
              label="Chave PIX"
              name="pixKey"
              value={formData.pixKey}
              onChange={handleChange}
            />
          </Box>
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
                {Object.keys(categoryLabels).map((key) => (
                  <MenuItem key={key} value={parseInt(key)}>
                    {categoryLabels[key]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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

export default PaymentForm;

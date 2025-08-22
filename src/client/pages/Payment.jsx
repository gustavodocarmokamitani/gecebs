import React, { useState, useEffect } from 'react';
import PaymentCard from '../components/card/PaymentCard';
import {
  Typography,
  Divider,
  Box,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import { useResponsive } from '../hooks/useResponsive';
import CustomButton from '../components/common/CustomButton';
import CustomInput from '../components/common/CustomInput';
import PaymentService from '../services/Payment';
import { toast } from 'react-toastify';

// ⚠️ Removemos os dados mockados de pagamentos e categoryLabels
// const pagamentos = [...];
// const categoryLabels = {...};

function Payment() {
  const theme = useTheme();
  const deviceType = useResponsive();
  const isMobile = deviceType === 'mobile' || deviceType === 'tablet';
  const navigate = useNavigate();

  // 👈 Novos estados para os dados da API e controle de UI
  const [payments, setPayments] = useState([]);
  const [groupedPayments, setGroupedPayments] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const groupPaymentsByCategory = (paymentsToGroup) => {
    const groups = {};
    paymentsToGroup.forEach((payment) => {
      // ⚠️ Usamos o 'category' aninhado que vem da API
      const categoryId = payment.category?.id || 'no-category';
      if (!groups[categoryId]) {
        groups[categoryId] = {
          name: payment.category?.name || 'Sem Categoria',
          payments: [],
        };
      }
      groups[categoryId].payments.push(payment);
    });
    return groups;
  };

  // 👈 Função para buscar os pagamentos da API
  const fetchPayments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedPayments = await PaymentService.listAllTeamPayments();
      setPayments(fetchedPayments);
    } catch (err) {
      console.error('Erro ao buscar pagamentos:', err);
      setError('Erro ao carregar os pagamentos. Tente novamente mais tarde.');
      toast.error('Erro ao carregar os pagamentos.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []); // 👈 A chamada da API é feita apenas na montagem inicial

  useEffect(() => {
    const filteredPayments = payments.filter(
      (payment) =>
        payment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (payment.pixKey && payment.pixKey.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setGroupedPayments(groupPaymentsByCategory(filteredPayments));
  }, [payments, searchTerm]);

  const handleAddPaymentClick = () => {
    navigate('/payment/new');
  };

  // ⚠️ Adicionei funções para exclusão e edição, que você pode passar para o PaymentCard
  const handleDeletePayment = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este pagamento?')) {
      try {
        await PaymentService.delete(id);
        toast.success('Pagamento excluído com sucesso!');
        fetchPayments(); // Recarrega os dados para atualizar a lista
      } catch (err) {
        console.error('Erro ao excluir pagamento:', err);
        toast.error('Erro ao excluir o pagamento.');
      }
    }
  };

  const handleEditPayment = (id) => {
    navigate(`/payment/edit/${id}`);
  };

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
          Gestão de Despesas
          <span>
            <ChevronRightIcon sx={{ mt: 1.5 }} />
          </span>
          <Box component="span" color="primary.main" sx={{ fontWeight: 100 }}>
            Visão Geral
          </Box>
        </Typography>
        <CustomButton
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddPaymentClick}
          sx={{ mr: isMobile ? 0 : 5 }}
        >
          Adicionar Pagamento
        </CustomButton>
      </Box>
      <Divider sx={{ my: 2, borderColor: theme.palette.divider }} />
      <Box sx={{ mt: 2, mb: 4, mr: isMobile ? 0 : 5 }}>
        <CustomInput
          label="Buscar Pagamento"
          placeholder="Digite o nome do pagamento ou chave PIX"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>

      <Typography sx={{ my: 3 }} variant="h6" color="textSecondary">
        Pagamentos
      </Typography>

      {/* 👈 Lógica de renderização condicional */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" align="center">
          {error}
        </Typography>
      ) : Object.keys(groupedPayments).length === 0 ? (
        <Typography color="text.secondary" align="center">
          Nenhum pagamento encontrado.
        </Typography>
      ) : (
        Object.keys(groupedPayments).map((categoryId, index) => {
          const group = groupedPayments[categoryId];
          if (group.payments.length === 0) return null;

          return (
            <Accordion
              key={categoryId}
              expanded={expanded === categoryId}
              onChange={handleAccordionChange(categoryId)}
              sx={{
                mb: 2,
                '&::before': { display: 'none' },
                ...(index === 0 && {
                  borderTopLeftRadius: theme.shape.borderRadius,
                  borderTopRightRadius: theme.shape.borderRadius,
                }),
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel-${categoryId}-content`}
                id={`panel-${categoryId}-header`}
                sx={{ borderBottom: 'none' }}
              >
                <Typography variant="h6" color="textPrimary">
                  {group.name}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box
                  sx={{
                    display: 'flex',
                    overflowX: 'auto',
                    gap: 2,
                    pb: 2,
                    '&::-webkit-scrollbar': { height: 8, width: 8 },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: theme.palette.primary.main,
                      borderRadius: 4,
                    },
                    alignItems: 'flex-start',
                  }}
                >
                  {group.payments.map((payment) => (
                    <PaymentCard
                      key={payment.id}
                      payment={payment}
                      onEdit={() => handleEditPayment(payment.id)}
                      onDelete={() => handleDeletePayment(payment.id)}
                    />
                  ))}
                </Box>
              </AccordionDetails>
            </Accordion>
          );
        })
      )}
    </Box>
  );
}

export default Payment;

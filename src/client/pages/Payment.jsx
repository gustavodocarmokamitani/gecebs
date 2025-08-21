import react, { useState, useEffect } from 'react';
import PaymentCard from '../components/card/PaymentCard';
import {
  Typography,
  Divider,
  Box,
  Button,
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

// Dados de exemplo baseados no seu esquema
const pagamentos = [
  {
    id: 1,
    name: 'Taxa de Inscrição',
    value: 50.0,
    dueDate: '2025-09-10T00:00:00.000Z',
    pixKey: 'pix123',
    teamId: 1,
    categoryId: 1,
    paidBy: [
      {
        userId: 101,
        user: { firstName: 'Lucas', lastName: 'Silva' },
        paidAt: '2025-09-05T00:00:00.000Z',
      },
      { userId: 102, user: { firstName: 'Mariana', lastName: 'Oliveira' }, paidAt: null },
    ],
    items: [
      { id: 1, name: 'Inscrição do Torneio', value: 30.0, quantityEnabled: false },
      { id: 2, name: 'Taxa de Arbitragem', value: 20.0, quantityEnabled: false },
    ],
  },
  {
    id: 2,
    name: 'Uniformes do Time',
    value: 120.0,
    dueDate: '2025-10-01T00:00:00.000Z',
    pixKey: 'pix456',
    teamId: 1,
    categoryId: 2,
    paidBy: [
      {
        userId: 103,
        user: { firstName: 'Pedro', lastName: 'Santos' },
        paidAt: '2025-09-25T00:00:00.000Z',
      },
    ],
    items: [
      { id: 3, name: 'Camisa do Uniforme', value: 80.0, quantityEnabled: true },
      { id: 4, name: 'Shorts do Uniforme', value: 40.0, quantityEnabled: true },
    ],
  },
  // Adicione mais pagamentos aqui
];

const categoryLabels = {
  1: 'Adulto',
  2: 'Sub-23',
  3: 'Juvenil',
  4: 'Junior',
  5: 'Pré-Junior',
  6: 'Infantil',
  7: 'Pré-Infantil',
  8: 'T-Bol',
};

function Payment() {
  const theme = useTheme();

  const deviceType = useResponsive();
  const isMobile = deviceType === 'mobile' || deviceType === 'tablet';
  const navigate = useNavigate();
  const [groupedPayments, setGroupedPayments] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [expanded, setExpanded] = useState(false);

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  useEffect(() => {
    const groupPaymentsByCategory = (payments) => {
      const groups = {};
      payments.forEach((payment) => {
        const categoryId = payment.categoryId;
        if (!groups[categoryId]) {
          groups[categoryId] = [];
        }
        groups[categoryId].push(payment);
      });
      return groups;
    };

    const filteredPayments = pagamentos.filter(
      (payment) =>
        payment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.pixKey.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setGroupedPayments(groupPaymentsByCategory(filteredPayments));
  }, [searchTerm]);

  const handleAddPaymentClick = () => {
    navigate('/payment/new');
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
      {Object.keys(groupedPayments).map((categoryId, index) => {
        const paymentsInGroup = groupedPayments[categoryId];
        if (paymentsInGroup.length === 0) return null;

        return (
          <Accordion
            key={categoryId}
            expanded={expanded === categoryId}
            onChange={handleAccordionChange(categoryId)}
            sx={{
              mb: 2,
              '&::before': {
                display: 'none',
              },
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
                {categoryLabels[categoryId]}
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
                {paymentsInGroup.map((payment) => (
                  <PaymentCard key={payment.id} payment={payment} />
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Box>
  );
}

export default Payment;

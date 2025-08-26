import React, { useState, useEffect } from 'react';
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
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PaymentService from '../services/Payment';
import AthletePaymentCard from '../components/card/AthletePaymentCard';
import { toast } from 'react-toastify';
import CustomInput from '../components/common/CustomInput'; // Importação do CustomInput

function AthletePaymentsHistory() {
  const theme = useTheme();

  const [payments, setPayments] = useState([]);
  const [groupedPayments, setGroupedPayments] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // Novo estado para o termo de busca

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const fetchPaymentsHistory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const paymentsResponse = await PaymentService.listMyPayments();

      // Mapeia e limpa a estrutura de dados
      const uniquePaymentsMap = new Map();
      paymentsResponse.forEach((pUser) => {
        uniquePaymentsMap.set(pUser.payment.id, pUser);
      });
      const cleanedPayments = Array.from(uniquePaymentsMap.values()).map((pUser) => ({
        ...pUser.payment,
        paidAt: pUser.paidAt,
      }));

      setPayments(cleanedPayments);
    } catch (err) {
      console.error('Erro ao buscar histórico de pagamentos:', err);
      setError('Erro ao carregar o histórico de pagamentos. Tente novamente mais tarde.');
      toast.error('Erro ao carregar o histórico de pagamentos.');
    } finally {
      setIsLoading(false);
    }
  };

  // Função para agrupar os pagamentos por mês e ano
  const groupPaymentsByMonthAndYear = (paymentsToGroup) => {
    const groups = {};
    paymentsToGroup.forEach((payment) => {
      const date = new Date(payment.dueDate);
      const monthYear = date.toLocaleString('pt-BR', {
        year: 'numeric',
        month: 'long',
      });
      if (!groups[monthYear]) {
        groups[monthYear] = [];
      }
      groups[monthYear].push(payment);
    });

    const sortedKeys = Object.keys(groups).sort((a, b) => {
      const [monthA, yearA] = a.split(' de ');
      const [monthB, yearB] = b.split(' de ');
      const dateA = new Date(`${monthA} 1, ${yearA}`);
      const dateB = new Date(`${monthB} 1, ${yearB}`);
      return dateB - dateA;
    });

    const sortedGroups = {};
    sortedKeys.forEach((key) => {
      sortedGroups[key] = groups[key];
    });

    return sortedGroups;
  };

  useEffect(() => {
    fetchPaymentsHistory();
  }, []);

  useEffect(() => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();

    // Lógica de busca e filtro
    const filteredPayments = payments.filter((payment) => {
      // Verifica se o pagamento é válido
      if (!payment || typeof payment !== 'object') return false;

      // Busca por nome do pagamento
      const matchesName = payment.name?.toLowerCase().includes(normalizedSearchTerm);

      // Busca por chave PIX
      const matchesPixKey = payment.pixKey?.toLowerCase().includes(normalizedSearchTerm);

      // Busca por data de vencimento (mês, dia ou ano)
      const matchesDate = new Date(payment.dueDate)
        .toLocaleDateString('pt-BR')
        .includes(normalizedSearchTerm);

      return matchesName || matchesPixKey || matchesDate;
    });

    setGroupedPayments(groupPaymentsByMonthAndYear(filteredPayments));
  }, [payments, searchTerm]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center" sx={{ mt: 4 }}>
        {error}
      </Typography>
    );
  }

  const sortedMonthYears = Object.keys(groupedPayments);

  return (
    <Box>
      <Typography variant="h6" color="text.primary" gutterBottom>
        Histórico de Pagamentos
      </Typography>
      <Divider sx={{ my: 2, borderColor: theme.palette.divider }} />

      {/* Input de busca */}
      <Box sx={{ mt: 2, mb: 4 }}>
        <CustomInput
          label="Buscar Pagamento"
          placeholder="Digite o nome, chave PIX ou data de vencimento"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>

      {payments.length === 0 ? (
        <Typography color="text.secondary" align="center" sx={{ mt: 4 }}>
          Nenhum pagamento encontrado.
        </Typography>
      ) : sortedMonthYears.length === 0 ? (
        <Typography color="text.secondary" align="center" sx={{ mt: 4 }}>
          Nenhum pagamento corresponde à sua busca.
        </Typography>
      ) : (
        sortedMonthYears.map((monthYear) => (
          <Accordion
            key={monthYear}
            expanded={expanded === monthYear}
            onChange={handleAccordionChange(monthYear)}
            sx={{ my: 2, '&::before': { display: 'none' } }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel-${monthYear}-content`}
              id={`panel-${monthYear}-header`}
            >
              <Typography variant="h6" color="textPrimary">
                {monthYear}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                {groupedPayments[monthYear].map((payment) => (
                  <AthletePaymentCard key={`payment-${payment.id}`} payment={payment} />
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>
        ))
      )}
    </Box>
  );
}

export default AthletePaymentsHistory;

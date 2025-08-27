import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Divider, Box, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { toast } from 'react-toastify';
import EventService from '../services/Event';
import PaymentService from '../services/Payment';
import AthleteEventCard from '../components/card/AthleteEventCard';
import AthletePaymentCard from '../components/card/AthletePaymentCard';

function AthleteDashboard() {
  const theme = useTheme();
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const navigateToPaymentDetails = (paymentId) => {
    navigate(`/payment/${paymentId}`);
  };

  const fetchAthleteData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const eventsResponse = await EventService.listMyEvents();
      const paymentsResponse = await PaymentService.listMyPayments();

      const eventsData = Array.isArray(eventsResponse) ? eventsResponse : [];
      const paymentsData = Array.isArray(paymentsResponse) ? paymentsResponse : [];

      // Deduplicação dos eventos
      const uniqueEventsMap = new Map();
      eventsData.forEach((event) => {
        uniqueEventsMap.set(event.id, event);
      });
      const uniqueEvents = Array.from(uniqueEventsMap.values());

      // Deduplicação dos pagamentos
      const uniquePaymentsMap = new Map();
      paymentsData.forEach((pUser) => {
        uniquePaymentsMap.set(pUser.payment.id, pUser);
      });

      // Mapear os pagamentos para uma estrutura mais limpa
      const cleanedPayments = Array.from(uniquePaymentsMap.values()).map((pUser) => ({
        ...pUser.payment, // Pega todas as propriedades do objeto 'payment' aninhado
        paidAt: pUser.paidAt, // Adiciona a propriedade 'paidAt' do objeto principal
      }));

      setEvents(uniqueEvents);
      setPayments(cleanedPayments);
    } catch (err) {
      console.error('Erro ao buscar dados do atleta:', err);
      setError('Erro ao carregar os dados. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAthleteData();
  }, []);

  // Agora que a estrutura de 'payments' foi corrigida, o filtro funcionará
  const pendingPayments = payments.filter((p) => p.paidAt === null);
  const paidPayments = payments.filter((p) => p.paidAt !== null);

  const paidPaymentsByMonth = paidPayments.reduce((acc, payment) => {
    const month = new Date(payment.dueDate).toLocaleString('pt-BR', {
      year: 'numeric',
      month: 'long',
    });
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(payment);
    return acc;
  }, {});

  return (
    <Box>
      <Typography
        component="h6"
        variant="h6"
        gutterBottom
        color={theme.palette.text.secondary}
        sx={{ fontWeight: 400, mt: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}
      >
        Dashboard
        <span>
          <ChevronRightIcon sx={{ mt: 1.5 }} />
        </span>
        <Box component="div" color="primary.main" sx={{ fontWeight: 100 }}>
          Visão Geral
        </Box>
      </Typography>
      <Divider sx={{ my: 1, borderColor: theme.palette.divider }} />
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" align="center" component="div">
          {error}
        </Typography>
      ) : (
        <>
          <Typography sx={{ my: 3 }} variant="h6" color="textSecondary" component="div">
            Central de Eventos
          </Typography>
          <Box
            sx={{
              display: 'flex',
              overflowX: 'auto',
              gap: 2,
              pb: 2,
              '&::-webkit-scrollbar': { height: 8 },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: theme.palette.primary.main,
                borderRadius: 4,
              },
              alignItems: 'flex-start',
            }}
          >
            {events.length > 0 ? (
              events
                .filter((event) => !event.confirmedAt)
                .map((event) => (
                  <AthleteEventCard
                    key={`event-${event.id}`}
                    event={event}
                    isConfirmed={!!event.confirmedAt}
                    payment={payments.find((p) => p.eventId === event.id)}
                  />
                ))
            ) : (
              <Typography
                color="text.secondary"
                align="center"
                sx={{ width: '100%' }}
                component="div"
              >
                Nenhum evento futuro encontrado.
              </Typography>
            )}
          </Box>
          <Divider sx={{ my: 2, borderColor: theme.palette.divider }} />
          <Typography sx={{ my: 3 }} variant="h6" color="textSecondary" component="div">
            Pagamentos Pendentes
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            {pendingPayments.length === 0 ? (
              <Typography color="text.secondary" align="center" component="div">
                Você não tem pagamentos pendentes.
              </Typography>
            ) : (
              pendingPayments.map((payment) => (
                <AthletePaymentCard
                  key={`payment-${payment.id}`}
                  payment={payment}
                  onConfirmPayment={navigateToPaymentDetails}
                />
              ))
            )}
          </Box>
        </>
      )}
    </Box>
  );
}

export default AthleteDashboard;

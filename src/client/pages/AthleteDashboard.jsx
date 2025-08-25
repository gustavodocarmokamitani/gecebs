import React, { useState, useEffect } from 'react';
import AthleteEventCard from '../components/card/AthleteEventCard';
import AthletePaymentCard from '../components/card/AthletePaymentCard';
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
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import EventService from '../services/Event'; // Assumindo um serviço de eventos para o atleta
import PaymentService from '../services/Payment'; // Assumindo um serviço de pagamentos para o atleta
import { toast } from 'react-toastify';

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

  const navigateToPayment = (paymentId) => {
    navigate(`/payment/details/${paymentId}`); // Exemplo de rota de detalhe de pagamento
  };

  // Funções de busca de dados
  const fetchAthleteData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [eventsData, paymentsData] = await Promise.all([
        // ⚠️ Mude EventService.listAthleteEvents()
        // ✅ Para EventService.listMyEvents()
        EventService.listMyEvents(),
        PaymentService.listMyPayments(),
      ]);
      setEvents(eventsData);
      setPayments(paymentsData);
    } catch (err) {
      console.error('Erro ao buscar dados do atleta:', err);
      setError('Erro ao carregar os dados. Tente novamente mais tarde.');
      toast.error('Erro ao carregar o dashboard.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAthleteData();
  }, []);

  // Lógica de agrupamento dos pagamentos
  const pendingEventPayments = payments.filter((p) => p.status === 'pending' && p.eventId);
  const otherPendingPayments = payments.filter((p) => p.status === 'pending' && !p.eventId);
  const paidPayments = payments.filter((p) => p.status === 'paid');

  const paidPaymentsByMonth = paidPayments.reduce((acc, payment) => {
    const month = new Date(payment.createdAt).toLocaleString('pt-BR', {
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
        <Box component="span" color="primary.main" sx={{ fontWeight: 100 }}>
          Visão Geral
        </Box>
      </Typography>
      <Divider sx={{ my: 1, borderColor: theme.palette.divider }} />

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" align="center">
          {error}
        </Typography>
      ) : (
        <>
          {/* Central de Eventos */}
          <Typography sx={{ my: 3 }} variant="h6" color="textSecondary">
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
              events.map((event) => (
                <AthleteEventCard
                  key={event.id}
                  event={event}
                  payment={payments.find((p) => p.eventId === event.id)}
                  onNavigateToPayment={navigateToPayment}
                />
              ))
            ) : (
              <Typography color="text.secondary" align="center" sx={{ width: '100%' }}>
                Nenhum evento futuro encontrado.
              </Typography>
            )}
          </Box>
          <Divider sx={{ my: 2, borderColor: theme.palette.divider }} />

          {/* Pagamentos Pendentes */}
          <Typography sx={{ my: 3 }} variant="h6" color="textSecondary">
            Pagamentos Pendentes
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            {pendingEventPayments.length === 0 && otherPendingPayments.length === 0 ? (
              <Typography color="text.secondary" align="center">
                Você não tem pagamentos pendentes.
              </Typography>
            ) : (
              <>
                {pendingEventPayments.map((payment) => (
                  <AthletePaymentCard
                    key={payment.id}
                    payment={payment}
                    navigateToPayment={navigateToPayment}
                  />
                ))}
                {otherPendingPayments.map((payment) => (
                  <AthletePaymentCard
                    key={payment.id}
                    payment={payment}
                    navigateToPayment={navigateToPayment}
                  />
                ))}
              </>
            )}
          </Box>
          <Divider sx={{ my: 2, borderColor: theme.palette.divider }} />

          {/* Pagamentos Realizados */}
          <Typography sx={{ my: 3 }} variant="h6" color="textSecondary">
            Histórico de Pagamentos
          </Typography>
          {Object.keys(paidPaymentsByMonth).length === 0 ? (
            <Typography color="text.secondary" align="center">
              Nenhum pagamento realizado.
            </Typography>
          ) : (
            Object.keys(paidPaymentsByMonth).map((month) => (
              <Accordion
                key={month}
                expanded={expanded === month}
                onChange={handleAccordionChange(month)}
                sx={{ mb: 2 }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6" color="textPrimary">
                    {month}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {paidPaymentsByMonth[month].map((payment) => (
                      <AthletePaymentCard key={payment.id} payment={payment} />
                    ))}
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))
          )}
        </>
      )}
    </Box>
  );
}

export default AthleteDashboard;

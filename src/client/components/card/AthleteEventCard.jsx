// src/components/card/AthleteEventCard.jsx

import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useResponsive } from '../../hooks/useResponsive';
import CustomButton from '../common/CustomButton';

const AthleteEventCard = ({ event, payment }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const deviceType = useResponsive();
  const isMobile = deviceType === 'mobile' || deviceType === 'tablet';

  const navigateToEventDetails = () => {
    // Navega para a página de detalhes do evento/confirmação de presença
    navigate(`/athlete/events/${event.id}`);
  };

  const navigateToPaymentDetails = () => {
    // Navega para a página de detalhes do pagamento
    if (payment) {
      navigate(`/athlete/payments/${payment.id}`);
    }
  };

  const formattedDate = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(event.date));

  return (
    <Card
      sx={{
        minWidth: isMobile ? 300 : 350,
        margin: 2,
        borderRadius: '12px',
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        border: `1px solid ${theme.palette.text.secondary}`,
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="p" component="div" fontWeight="bold">
          {event.name}
        </Typography>
        <Typography variant="p" color={theme.palette.text.secondary} component="div" sx={{ mt: 1 }}>
          Data: {formattedDate}
        </Typography>
        <Typography variant="p" color={theme.palette.text.secondary} component="div">
          Local: {event.location}
        </Typography>
        <Divider sx={{ my: 2, borderColor: theme.palette.divider }} />
        <CardContent sx={{ p: 0 }}>
          <Typography variant="subtitle2" fontWeight={600} color="text.secondary">
            Itens do Evento:
          </Typography>
          {event.items && event.items.length > 0 ? (
            event.items.map((item, index) => (
              <Typography key={index} variant="body2" color="text.secondary">
                - {item.name}: R$ {item.value.toFixed(2)}
              </Typography>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              Nenhum item associado.
            </Typography>
          )}
        </CardContent>
      </Box>

      {/* Ações para o atleta */}
      <Box sx={{ p: 2, pt: 0 }}>
        {payment && payment.status === 'pending' ? (
          // Exibe o botão de pagamento se houver um pagamento pendente
          <CustomButton
            variant="contained"
            color="primary"
            onClick={navigateToPaymentDetails}
            sx={{ width: '100%' }}
          >
            Ir para Pagamento (R$ {payment.value.toFixed(2)})
          </CustomButton>
        ) : (
          // Exibe o botão de confirmação se o evento não tiver pagamento pendente
          <CustomButton
            variant="contained"
            color="secondary"
            onClick={navigateToEventDetails}
            sx={{ width: '100%' }}
          >
            Confirmar Presença
          </CustomButton>
        )}
      </Box>
    </Card>
  );
};

export default AthleteEventCard;

import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, Divider, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useResponsive } from '../../hooks/useResponsive';
import CustomButton from '../common/CustomButton';
import EventService from '../../services/Event';
import { toast } from 'react-toastify';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';

const AthleteEventCard = ({ event, isConfirmed }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const deviceType = useResponsive();
  const isMobile = deviceType === 'mobile' || deviceType === 'tablet';

  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirmPresence = async () => {
    setIsConfirming(true);
    try {
      await EventService.confirmPresence(event.id);
      toast.success('Presença confirmada com sucesso!');
      // Opcional: recarregar a página para atualizar o estado do dashboard
      window.location.reload();
    } catch (error) {
      console.error('Erro ao confirmar presença:', error);
      toast.error('Erro ao confirmar presença. Tente novamente.');
    } finally {
      setIsConfirming(false);
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
        minWidth: isMobile ? 270 : 350,
        maxWidth: isMobile ? 300 : 350,
        margin: 2,
        borderRadius: '12px',
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        border: `1px solid ${theme.palette.text.secondary}`,
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" component="div" fontWeight="bold">
          {event.name}
        </Typography>
        {event.date ? (
          <Typography
            variant="body2"
            color={theme.palette.text.secondary}
            component="div"
            sx={{ mt: 1 }}
          >
            Data: {formattedDate}
          </Typography>
        ) : null}
        {event.location ? (
          <Typography variant="body2" color={theme.palette.text.secondary} component="div">
            Local: {event.location}
          </Typography>
        ) : null}
        {event.description ? (
          <Typography variant="body2" color={theme.palette.text.secondary} component="div">
            Descrição: {event.description}
          </Typography>
        ) : null}
      </Box>

      <Box sx={{ p: 2, pt: 0 }}>
        {event.isFinalized ? (
          // Se o evento estiver finalizado, a lógica é diferente
          isConfirmed ? (
            // Se confirmado, mostra "Presença Confirmada"
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: theme.palette.success.main,
                gap: 1,
              }}
            >
              <CheckCircleOutlineIcon />
              <Typography variant="body1" component="span">
                Presença Confirmada
              </Typography>
            </Box>
          ) : (
            // Se não confirmado, mostra "Evento Finalizado"
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: theme.palette.warning.main,
                gap: 1,
              }}
            >
              <EventAvailableIcon />
              <Typography variant="body1" component="span">
                Evento Finalizado
              </Typography>
            </Box>
          )
        ) : isConfirmed ? (
          // Se o evento não estiver finalizado e a presença já estiver confirmada
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: theme.palette.success.main,
              gap: 1,
            }}
          >
            <CheckCircleOutlineIcon />
            <Typography variant="body1" component="span">
              Presença Confirmada
            </Typography>
          </Box>
        ) : (
          // Se o evento não estiver finalizado e a presença não tiver sido confirmada
          <CustomButton
            variant="contained"
            color="secondary"
            onClick={handleConfirmPresence}
            sx={{ width: '100%' }}
            disabled={isConfirming}
          >
            {isConfirming ? <CircularProgress size={24} /> : 'Confirmar Presença'}
          </CustomButton>
        )}
      </Box>
    </Card>
  );
};

export default AthleteEventCard;

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  List,
  ListItem,
  ListItemText,
  Collapse,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTheme } from '@mui/material/styles';
import { useResponsive } from '../../hooks/useResponsive';

// Componente do Card de Evento Colapsável
const EventCard = ({ event }) => {
  // Estado para controlar se o card está expandido ou colapsado
  const [isExpanded, setIsExpanded] = useState(false);
  const theme = useTheme();

  const deviceType = useResponsive();
  const isMobile = deviceType === 'mobile' || deviceType === 'tablet';

  // Função para alternar o estado de expansão
  const handleExpandClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Card
      sx={{
        maxWidth: 500,
        margin: 2,
        borderRadius: '12px',
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        border: `1px solid ${theme.palette.text.secondary}`,
      }}
    >
      {/* Título do Card e Contagem de Confirmados */}
      <Box
        onClick={handleExpandClick}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'start',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Typography variant="p" component="div">
            {event.name}
          </Typography>
          <Typography variant="p" component="div" fontWeight={300}>
            Data:
            <span style={{ color: theme.palette.primary.main, fontWeight: '600' }}>
              {' '}
              24/04/2025
            </span>
          </Typography>
          <Typography variant="p" component="div" fontWeight={300}>
            Atletas:
            <span style={{ color: theme.palette.secondary.main, fontWeight: '600' }}> 14 </span>
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography
            variant="subtitle1"
            sx={{ mr: 1, color: theme.palette.text.secondary }}
          ></Typography>
          {/* Botão com ícone de seta que rotaciona */}
          <IconButton
            onClick={handleExpandClick}
            aria-expanded={isExpanded}
            aria-label="mostrar mais"
            sx={{
              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: theme.transitions.create('transform', {
                duration: theme.transitions.duration.shortest,
              }),
            }}
          >
            <ExpandMoreIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Conteúdo Colapsável */}
      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: isMobile ? 'center' : 'start',
            flexDirection: isMobile ? 'column' : 'row',
          }}
        >
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography
              variant="subtitle3"
              fontWeight={600}
              sx={{ mb: 1, color: theme.palette.secondary.main }}
            >
              Confirmados ({event.confirmedAthletes.length})
            </Typography>

            {event.confirmedAthletes.length > 0 ? (
              <List dense>
                {event.confirmedAthletes.map((athlete) => (
                  <ListItem key={athlete.id}>
                    <ListItemText primary={athlete.name} />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                Nenhum atleta pendente de confirmação.
              </Typography>
            )}
          </CardContent>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography
              variant="subtitle3"
              fontWeight={600}
              sx={{ mb: 1, color: theme.palette.error.main }}
            >
              Pendentes ({event.unconfirmedAthletes.length})
            </Typography>

            {event.unconfirmedAthletes.length > 0 ? (
              <List dense>
                {event.unconfirmedAthletes.map((athlete) => (
                  <ListItem key={athlete.id}>
                    <ListItemText primary={athlete.name} />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                Nenhum atleta pendente de confirmação.
              </Typography>
            )}
          </CardContent>
        </Box>
      </Collapse>
    </Card>
  );
};

export default EventCard;

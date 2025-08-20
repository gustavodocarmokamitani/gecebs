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
        minWidth: 320,
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
          <Typography variant="p" color={theme.palette.text.secondary} component="div">
            {event.description}
          </Typography>
          <Typography variant="p" color={theme.palette.text.secondary} component="div">
            {event.location}
          </Typography>
          <Typography
            variant="p"
            color={theme.palette.text.secondary}
            component="div"
            fontWeight={300}
          >
            {new Intl.DateTimeFormat("pt-BR").format(new Date(event.date))}
          </Typography>
          <Typography variant="p" color={theme.palette.text.secondary} component="div" fontWeight={300}>
            Atletas:
            <span style={{ color: theme.palette.secondary.main, fontWeight: '600' }}> {event.confirmedAthletes.length + event.unconfirmedAthletes.length} </span>
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
            justifyContent: 'space-around',
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

            {event.confirmedAthletes.length > 0 && (
              <List dense>
                {event.confirmedAthletes.map((athlete) => (
                  <ListItem key={athlete.id}>
                    <ListItemText primary={athlete.name} />
                  </ListItem>
                ))}
              </List>
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

            {event.unconfirmedAthletes.length > 0 && (
              <List dense>
                {event.unconfirmedAthletes.map((athlete) => (
                  <ListItem key={athlete.id}>
                    <ListItemText primary={athlete.name} />
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>
        </Box>
      </Collapse>
    </Card>
  );
};

export default EventCard;

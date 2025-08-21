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
  Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTheme } from '@mui/material/styles';
import { useResponsive } from '../../hooks/useResponsive';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye';

// Componente do Card de Evento Colapsável
const EventCard = ({ event }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const theme = useTheme();

  const deviceType = useResponsive();
  const isMobile = deviceType === 'mobile' || deviceType === 'tablet';

  const handleExpandClick = () => {
    setIsExpanded(!isExpanded);
  };

  const getBackgroundColor = (index) => {
    return index % 2 === 0 ? '#2c2c2c' : '#050505';
  };

  const allAthletes = [...event.confirmedAthletes, ...event.unconfirmedAthletes];

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
            {new Intl.DateTimeFormat('pt-BR').format(new Date(event.date))}
          </Typography>
          <Typography
            variant="p"
            color={theme.palette.text.secondary}
            component="div"
            fontWeight={300}
          >
            Atletas:
            <span style={{ color: theme.palette.secondary.main, fontWeight: '600' }}>
              {' '}
              {allAthletes.length}{' '}
            </span>
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
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

      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <CardContent sx={{ textAlign: 'center', pt: 2, pb: 0 }}>
            <Typography
              variant="subtitle3"
              fontWeight={600}
              sx={{ mb: 1, color: theme.palette.text.secondary }}
            >
              Lista de Atletas
            </Typography>
            <Divider sx={{ my: 1, borderColor: theme.palette.divider }} />
            {allAthletes.length > 0 && (
              <List
                dense
                sx={{
                  maxHeight: 300,
                  overflowY: 'auto',
                  px: 3,
                  '&::-webkit-scrollbar': { height: 8, width: 8 },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: theme.palette.primary.main,
                    borderRadius: 4,
                  },
                }}
              >
                {allAthletes.map((athlete, index) => {
                  const isConfirmed = event.confirmedAthletes.some((a) => a.id === athlete.id);
                  return (
                    <ListItem
                      key={athlete.id}
                      sx={{
                        width: '250px',
                        textAlign: 'center',
                        backgroundColor: getBackgroundColor(index),
                        borderRadius: '8px',
                        marginBottom: '8px',
                        color: theme.palette.text.primary,
                        m: 0.5,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <ListItemText
                        primary={athlete.name}
                        secondary={isConfirmed ? 'Confirmado' : 'Pendente'}
                      />
                      <Box
                        sx={{
                          color: isConfirmed
                            ? theme.palette.success.main
                            : theme.palette.warning.main,
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        {isConfirmed ? <CheckCircleOutlineIcon /> : <PanoramaFishEyeIcon />}
                      </Box>
                    </ListItem>
                  );
                })}
              </List>
            )}
          </CardContent>
        </Box>
      </Collapse>
    </Card>
  );
};

export default EventCard;

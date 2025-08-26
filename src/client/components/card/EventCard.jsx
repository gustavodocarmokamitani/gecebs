import React, { useState, useEffect } from 'react';
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
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTheme } from '@mui/material/styles';
import { useResponsive } from '../../hooks/useResponsive';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye';
import CustomButton from '../common/CustomButton';
import EventService from '../../services/Event';
import { toast } from 'react-toastify';

const EventCard = ({ event, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [athletes, setAthletes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();
  const deviceType = useResponsive();
  const isMobile = deviceType === 'mobile' || deviceType === 'tablet';

  const handleExpandClick = () => {
    setIsExpanded(!isExpanded);
  };

  const getBackgroundColor = (index) => {
    return index % 2 === 0 ? '#2c2c2c' : '#050505';
  };

  const handleEditClick = () => {
    navigate(`/event/edit/${event.id}`);
  };

  useEffect(() => {
    if (isExpanded && event?.id) {
      const fetchAthletes = async () => {
        setIsLoading(true);
        try {
          const fetchedAthletes = await EventService.getConfirmedAthletes(event.id);
          setAthletes(fetchedAthletes);
        } catch (error) {
          console.error('Erro ao buscar atletas do evento:', error);
          toast.error('Erro ao carregar a lista de atletas.');
          setAthletes([]);
        } finally {
          setIsLoading(false);
        }
      };
      fetchAthletes();
    }
  }, [isExpanded, event?.id]);

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
            {event.type}
          </Typography>
          <Typography variant="p" color={theme.palette.text.secondary} component="div">
            {event.location}
          </Typography>
          {event.date ? (
            <Typography
              variant="p"
              color={theme.palette.text.secondary}
              component="div"
              fontWeight={300}
            >
              {new Intl.DateTimeFormat('pt-BR').format(new Date(event.date))}
            </Typography>
          ) : null}
          {event.description ? (
            <Typography variant="p" color={theme.palette.text.secondary} component="div">
              {event.description}
            </Typography>
          ) : null}
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
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                <CircularProgress size={24} />
              </Box>
            ) : Array.isArray(athletes) && athletes.length > 0 ? (
              <List dense>
                {athletes.map((athlete, index) => (
                  <ListItem
                    key={athlete.userId}
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
                      primary={`${athlete.firstName} ${athlete.lastName}`}
                      secondary={athlete.status ? 'Confirmado' : 'Pendente'}
                    />
                    <Box
                      sx={{
                        color: athlete.status
                          ? theme.palette.success.main
                          : theme.palette.warning.main,
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {athlete.status ? <CheckCircleOutlineIcon /> : <PanoramaFishEyeIcon />}
                    </Box>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                Nenhum atleta neste evento.
              </Typography>
            )}
          </CardContent>

          {/* Adicionando os botões de Ação aqui */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, my: 2, width: '90%' }}>
            <CustomButton variant="contained" color="warning" onClick={handleEditClick}>
              Editar
            </CustomButton>
            <CustomButton variant="contained" color="error" onClick={onDelete}>
              Apagar
            </CustomButton>
          </Box>
        </Box>
      </Collapse>
    </Card>
  );
};

export default EventCard;

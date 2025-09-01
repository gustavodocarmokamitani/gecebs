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
import { useTheme } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye';
import PaidIcon from '@mui/icons-material/Paid';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'; // Importação alterada para MUI
import { toast } from 'react-toastify';
import { useResponsive } from '../../hooks/useResponsive';
import EventService from '../../services/Event';

const AnalyticsEventCard = ({ event }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [athletes, setAthletes] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();

  const deviceType = useResponsive();
  const isMobile = deviceType === 'mobile' || deviceType === 'tablet';

  const handleExpandClick = () => {
    setIsExpanded(!isExpanded);
  };

  const getBackgroundColor = (index) => {
    return index % 2 === 0 ? '#2c2c2c' : '#050505';
  };

  useEffect(() => {
    if (isExpanded && event?.id) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const fetchedData = await EventService.getEventAnalytics(event.id);
          console.log(fetchedData.metrics);

          setAthletes(fetchedData.confirmedAthletes);
          setAnalytics(fetchedData.metrics);
          console.log(fetchedData);
        } catch (error) {
          console.error('Erro ao buscar dados do evento:', error);
          toast.error('Erro ao carregar os dados de analytics.');
          setAthletes([]);
          setAnalytics(null);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
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
          {event.description && (
            <Typography variant="p" color={theme.palette.text.secondary} component="div">
              {event.description}
            </Typography>
          )}
          {event.location && (
            <Typography variant="p" color={theme.palette.text.secondary} component="div">
              {event.location}
            </Typography>
          )}
          {event.date && (
            <Typography
              variant="p"
              color={theme.palette.text.secondary}
              component="div"
              fontWeight={300}
            >
              {new Intl.DateTimeFormat('pt-BR').format(new Date(event.date))}
            </Typography>
          )}
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
              Métricas do Evento
            </Typography>
            <Divider sx={{ my: 1, borderColor: theme.palette.divider }} />
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                <CircularProgress size={24} />
              </Box>
            ) : analytics ? (
              <List dense>
                <ListItem
                  sx={{ backgroundColor: getBackgroundColor(0), borderRadius: '8px', mb: 1 }}
                >
                  <CheckCircleOutlineIcon sx={{ mr: 2, color: theme.palette.success.main }} />
                  <ListItemText
                    primary={`Atletas Confirmados: ${analytics.confirmedAthletesCount}`}
                  />
                </ListItem>
                <ListItem
                  sx={{ backgroundColor: getBackgroundColor(1), borderRadius: '8px', mb: 1 }}
                >
                  <PaidIcon sx={{ mr: 2, color: theme.palette.success.main }} />
                  <ListItemText primary={`Atletas Pagos: ${analytics.paidAthletesCount}`} />
                </ListItem>
                <ListItem
                  sx={{ backgroundColor: getBackgroundColor(2), borderRadius: '8px', mb: 1 }}
                >
                  <PaidIcon sx={{ mr: 2, color: theme.palette.warning.main }} />
                  <ListItemText
                    primary={`Valor Recebido: R$ ${
                      analytics?.totalValueReceived?.toFixed(2) ?? '0.00'
                    }`}
                  />
                </ListItem>
                {analytics.itemsPaidByItem &&
                  Object.entries(analytics.itemsPaidByItem).length > 0 && (
                    <>
                      <Typography
                        variant="subtitle3"
                        fontWeight={600}
                        sx={{ my: 1, color: theme.palette.text.secondary }}
                      >
                        Itens Pagos
                      </Typography>
                      <Divider sx={{ my: 1, borderColor: theme.palette.divider }} />
                      {Object.entries(analytics.itemsPaidByItem).map(
                        ([itemName, quantity], index) => (
                          <ListItem
                            key={itemName}
                            sx={{
                              backgroundColor: getBackgroundColor(index % 2),
                              borderRadius: '8px',
                              mb: 1,
                            }}
                          >
                            <ShoppingCartIcon sx={{ mr: 2, color: theme.palette.primary.main }} />
                            <ListItemText primary={`${itemName}: ${quantity}`} />
                          </ListItem>
                        )
                      )}
                    </>
                  )}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 2 }}>
                Não foi possível carregar as métricas.
              </Typography>
            )}
          </CardContent>
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
                {athletes.map((athlete, index) => (
                  <ListItem
                    key={athlete.userId}
                    sx={{
                      width: '250px',
                      textAlign: 'start',
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
                      secondary={
                        <Typography component="span" variant="body2" color="text.secondary">
                          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <Typography component="span" variant="body2" color="text.secondary">
                              {athlete.status ? 'Confirmado' : 'Pendente'}
                            </Typography>
                            <Typography component="span" variant="body2" color="text.secondary">
                              |
                            </Typography>
                            <Typography component="span" variant="body2" color="text.secondary">
                              {athlete.hasPaid ? 'Pago' : 'Pendente'}
                            </Typography>
                          </Box>
                        </Typography>
                      }
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
                      <Box
                        sx={{
                          color: athlete.hasPaid
                            ? theme.palette.success.main
                            : theme.palette.error.main,
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        {athlete.hasPaid ? <PaidIcon /> : <PanoramaFishEyeIcon />}
                      </Box>
                    </Box>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                Nenhum atleta nesta categoria.
              </Typography>
            )}
          </CardContent>
        </Box>
      </Collapse>
    </Card>
  );
};

export default AnalyticsEventCard;

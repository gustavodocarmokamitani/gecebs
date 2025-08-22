import { useState, useEffect } from 'react';
import EventCard from '../components/card/EventCard';
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
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import { useResponsive } from '../hooks/useResponsive';
import CustomButton from '../components/common/CustomButton';
import CustomInput from '../components/common/CustomInput';
import EventService from '../services/Event';
import { toast } from 'react-toastify';

function Event() {
  const theme = useTheme();
  const deviceType = useResponsive();
  const isMobile = deviceType === 'mobile' || deviceType === 'tablet';
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [groupedEvents, setGroupedEvents] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);

  // Função para lidar com a mudança de estado dos acordeões
  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  // Função para buscar eventos da API
  const fetchEvents = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedEvents = await EventService.listAllTeamEvents();
      setEvents(fetchedEvents);
    } catch (err) {
      console.error('Erro ao buscar eventos:', err);
      setError('Erro ao carregar os eventos. Tente novamente mais tarde.');
      toast.error('Erro ao carregar os eventos.');
    } finally {
      setIsLoading(false);
    }
  };

  // Função para agrupar eventos por categoria
  const groupEventsByCategory = (eventsToGroup) => {
    const groups = {};
    eventsToGroup.forEach((event) => {
      const categoryId = event.category?.id || 'no-category';
      if (!groups[categoryId]) {
        groups[categoryId] = {
          name: event.category?.name || 'Sem Categoria',
          events: [],
        };
      }
      groups[categoryId].events.push(event);
    });
    return groups;
  };

  // Chama a API quando o componente é montado
  useEffect(() => {
    fetchEvents();
  }, []);

  // Filtra e agrupa os eventos sempre que a lista de eventos ou o termo de busca muda
  useEffect(() => {
    const filteredEvents = events.filter(
      (event) =>
        event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setGroupedEvents(groupEventsByCategory(filteredEvents));
  }, [events, searchTerm]);

  // Navega para a página de criação de eventos
  const handleAddEventClick = () => {
    navigate('/event/new');
  };

  // Navega para a página de edição de eventos
  const handleEditEvent = (id) => {
    navigate(`/event/edit/${id}`);
  };

  // Lógica para deletar um evento
  const handleDeleteEvent = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este evento?')) {
      try {
        await EventService.remove(id);
        toast.success('Evento excluído com sucesso!');
        fetchEvents(); // Recarrega os eventos
      } catch (err) {
        console.error('Erro ao excluir evento:', err);
        toast.error('Erro ao excluir o evento.');
      }
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? '' : 'center',
          gap: isMobile ? 2 : 0,
        }}
      >
        <Typography
          component="h6"
          variant="h6"
          gutterBottom
          color={theme.palette.text.secondary}
          sx={{
            fontWeight: 400,
            mt: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
          }}
        >
          Gestão de Eventos
          <span>
            <ChevronRightIcon sx={{ mt: 1.5 }} />
          </span>
          <Box component="span" color="primary.main" sx={{ fontWeight: 100 }}>
            Visão Geral
          </Box>
        </Typography>
        <CustomButton
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddEventClick}
          sx={{ mr: isMobile ? 0 : 5 }}
        >
          Adicionar Evento
        </CustomButton>
      </Box>
      <Divider sx={{ my: 2, borderColor: theme.palette.divider }} />
      <Box sx={{ mt: 2, mb: 4, mr: isMobile ? 0 : 5 }}>
        <CustomInput
          label="Buscar Evento"
          placeholder="Digite o nome do evento ou local"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>

      <Typography sx={{ my: 3 }} variant="h6" color="textSecondary">
        Eventos
      </Typography>

      {/* Renderização Condicional */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" align="center">
          {error}
        </Typography>
      ) : Object.keys(groupedEvents).length === 0 ? (
        <Typography color="text.secondary" align="center">
          Nenhum evento encontrado.
        </Typography>
      ) : (
        Object.keys(groupedEvents).map((categoryId, index) => {
          const group = groupedEvents[categoryId];
          if (group.events.length === 0) return null;

          return (
            <Accordion
              key={categoryId}
              expanded={expanded === categoryId}
              onChange={handleAccordionChange(categoryId)}
              sx={{
                mb: 2,
                '&::before': { display: 'none' },
                ...(index === 0 && {
                  borderTopLeftRadius: theme.shape.borderRadius,
                  borderTopRightRadius: theme.shape.borderRadius,
                }),
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel-${categoryId}-content`}
                id={`panel-${categoryId}-header`}
                sx={{ borderBottom: 'none' }}
              >
                <Typography variant="h6" color="textPrimary">
                  {group.name}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
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
                  {group.events.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onEdit={() => handleEditEvent(event.id)}
                      onDelete={() => handleDeleteEvent(event.id)}
                    />
                  ))}
                </Box>
              </AccordionDetails>
            </Accordion>
          );
        })
      )}
    </Box>
  );
}

export default Event;

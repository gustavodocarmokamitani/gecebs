import { useState, useEffect } from 'react';
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
import { toast } from 'react-toastify';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EventService from '../services/Event';
import AthleteEventCard from '../components/card/AthleteEventCard';
import CustomInput from '../components/common/CustomInput';

function AthleteEventsHistory() {
  const theme = useTheme();

  const [events, setEvents] = useState([]);
  const [groupedEvents, setGroupedEvents] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const fetchEventsHistory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedEvents = await EventService.listMyEventsAll();

      const uniqueEventsMap = new Map();
      fetchedEvents.forEach((event) => {
        uniqueEventsMap.set(event.id, event);
      });
      const uniqueEvents = Array.from(uniqueEventsMap.values());
      setEvents(uniqueEvents);
    } catch (err) {
      console.error('Erro ao buscar histórico de eventos:', err);
      setError('Erro ao carregar o histórico de eventos. Tente novamente mais tarde.');
      toast.error('Erro ao carregar o histórico de eventos.');
    } finally {
      setIsLoading(false);
    }
  };

  const groupEventsByYear = (eventsToGroup) => {
    const groups = {};
    eventsToGroup.forEach((event) => {
      const year = new Date(event.date).getFullYear();
      if (!groups[year]) {
        groups[year] = [];
      }
      groups[year].push(event);
    });

    const sortedYears = Object.keys(groups).sort((a, b) => b - a);
    const sortedGroups = {};
    sortedYears.forEach((year) => {
      sortedGroups[year] = groups[year];
    });
    return sortedGroups;
  };

  useEffect(() => {
    fetchEventsHistory();
  }, []);

  useEffect(() => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();

    const filteredEvents = events.filter((event) => {
      if (!event || typeof event !== 'object') return false;

      const matchesName = event.name?.toLowerCase().includes(normalizedSearchTerm);

      const matchesLocation = event.location?.toLowerCase().includes(normalizedSearchTerm);

      const eventDate = new Date(event.date);
      const matchesDate =
        eventDate.toLocaleDateString('pt-BR').includes(normalizedSearchTerm) ||
        eventDate.getFullYear().toString().includes(normalizedSearchTerm) ||
        eventDate
          .toLocaleString('pt-BR', { month: 'long' })
          .toLowerCase()
          .includes(normalizedSearchTerm);

      return matchesName || matchesLocation || matchesDate;
    });

    setGroupedEvents(groupEventsByYear(filteredEvents));
  }, [events, searchTerm]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center" sx={{ mt: 4 }}>
        {error}
      </Typography>
    );
  }

  const sortedYears = Object.keys(groupedEvents);

  return (
    <Box>
      <Typography variant="h6" color="text.primary" gutterBottom>
        Histórico de Eventos
      </Typography>
      <Divider sx={{ my: 2, borderColor: theme.palette.divider }} />

      <Box sx={{ mt: 2, mb: 4 }}>
        <CustomInput
          label="Buscar Evento"
          placeholder="Digite o nome, local ou ano do evento"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>

      {events.length === 0 ? (
        <Typography color="text.secondary" align="center" sx={{ mt: 4 }}>
          Nenhum evento encontrado.
        </Typography>
      ) : sortedYears.length === 0 ? (
        <Typography color="text.secondary" align="center" sx={{ mt: 4 }}>
          Nenhum evento corresponde à sua busca.
        </Typography>
      ) : (
        sortedYears.map((year) => (
          <Accordion
            key={year}
            expanded={expanded === year}
            onChange={handleAccordionChange(year)}
            sx={{ my: 2, '&::before': { display: 'none' } }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel-${year}-content`}
              id={`panel-${year}-header`}
            >
              <Typography variant="h6" color="textPrimary">
                Ano de {year}
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
                {groupedEvents[year].map((event) => (
                  <AthleteEventCard
                    key={`event-${event.id}`}
                    event={event}
                    isConfirmed={!!event.confirmedAt}
                  />
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>
        ))
      )}
    </Box>
  );
}

export default AthleteEventsHistory;

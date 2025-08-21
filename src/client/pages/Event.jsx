import react, { useState, useEffect } from 'react';
import EventCard from '../components/card/EventCard';
import {
  Typography,
  Divider,
  Box,
  Button,
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

// Dados de exemplo baseados no seu esquema
const users = [
  { id: 101, firstName: 'Lucas', lastName: 'Silva' },
  { id: 102, firstName: 'Mariana', lastName: 'Oliveira' },
  { id: 103, firstName: 'Pedro', lastName: 'Santos' },
];

const eventos = [
  {
    id: 1,
    name: 'Treino da Semana',
    description: 'Treino tático para o próximo jogo',
    date: '2025-08-25T19:00:00.000Z',
    location: 'Campo Principal',
    type: 'TRAINING',
    teamId: 1,
    categoryId: 1,
    confirmations: [
      {
        id: 1,
        confirmedBy: [
          { userId: 101, user: users[0], status: true },
          { userId: 102, user: users[1], status: false },
        ],
      },
    ],
  },
  {
    id: 2,
    name: 'Campeonato Regional',
    description: 'Primeira partida do campeonato',
    date: '2025-09-10T15:30:00.000Z',
    location: 'Estádio da Cidade',
    type: 'CHAMPIONSHIP',
    teamId: 1,
    categoryId: 2,
    confirmations: [
      {
        id: 2,
        confirmedBy: [
          { userId: 101, user: users[0], status: true },
          { userId: 103, user: users[2], status: true },
        ],
      },
    ],
  },
];

const categoryLabels = {
  1: 'Adulto',
  2: 'Sub-23',
  3: 'Juvenil',
  4: 'Junior',
  5: 'Pré-Junior',
  6: 'Infantil',
  7: 'Pré-Infantil',
  8: 'T-Bol',
};

function Event() {
  const theme = useTheme();

  const deviceType = useResponsive();
  const isMobile = deviceType === 'mobile' || deviceType === 'tablet';

  const navigate = useNavigate();

  const [groupedEvents, setGroupedEvents] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [expanded, setExpanded] = useState(false);

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  useEffect(() => {
    const groupEventsByCategory = (events) => {
      const groups = {};
      events.forEach((event) => {
        const categoryId = event.categoryId;
        if (!groups[categoryId]) {
          groups[categoryId] = [];
        }
        groups[categoryId].push(event);
      });
      return groups;
    };

    const filteredEvents = eventos.filter(
      (event) =>
        event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setGroupedEvents(groupEventsByCategory(filteredEvents));
  }, [searchTerm]);

  const handleAddEventClick = () => {
    navigate('/event/new');
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
      {Object.keys(groupedEvents).map((categoryId, index) => {
        const eventsInGroup = groupedEvents[categoryId];
        if (eventsInGroup.length === 0) return null;

        return (
          <Accordion
            key={categoryId}
            expanded={expanded === categoryId}
            onChange={handleAccordionChange(categoryId)}
            sx={{
              mb: 2,
              '&::before': {
                display: 'none',
              },
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
                {categoryLabels[categoryId]}
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
                {eventsInGroup.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Box>
  );
}

export default Event;

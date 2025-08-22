import React, { useState, useEffect } from 'react';
import AnalyticsEventCard from '../components/card/AnalyticsEventCard';
import {
  Typography,
  Divider,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import Event from '../services/Event';
import CategoryService from '../services/Category';
import { toast } from 'react-toastify';

function Analytics() {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const adaptEvent = (event) => {
    const confirmedAthletes = [];
    const unconfirmedAthletes = [];

    if (event.confirmations && event.confirmations[0] && event.confirmations[0].confirmedBy) {
      event.confirmations[0].confirmedBy.forEach((entry) => {
        const athlete = {
          id: entry.user.id,
          name: `${entry.user.firstName} ${entry.user.lastName}`,
        };
        if (entry.status) {
          confirmedAthletes.push(athlete);
        } else {
          unconfirmedAthletes.push(athlete);
        }
      });
    }

    return {
      id: event.id,
      name: event.name,
      description: event.description,
      date: event.date,
      location: event.location,
      confirmedAthletes,
      unconfirmedAthletes,
    };
  };

  // Funções para buscar os dados
  const fetchData = async () => {
    try {
      setIsLoading(true);
      // Busca categorias e eventos em paralelo para otimizar o tempo
      const [eventsData, categoriesData] = await Promise.all([
        Event.listAllTeamEvents(),
        CategoryService.getAll(),
      ]);

      setEvents(eventsData);
      setCategories(categoriesData); // 👈 Atualize o estado das categorias
    } catch (error) {
      console.error('Erro ao carregar dados de analytics:', error);
      toast.error('Não foi possível carregar os dados. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Cria um mapa de categorias dinâmico
  const categoryMap = categories.reduce((acc, category) => {
    acc[category.id] = category.name;
    return acc;
  }, {});

  // Agrupa os eventos pelas categorias
  const eventsByCategory = events.reduce((acc, event) => {
    const categoryId = event.categoryId;
    if (!acc[categoryId]) {
      acc[categoryId] = [];
    }
    acc[categoryId].push(event);
    return acc;
  }, {});

  return (
    <Box>
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
        Analytics
        <span>
          <ChevronRightIcon sx={{ mt: 1.5 }} />
        </span>
        <Box component="span" color="primary.main" sx={{ fontWeight: 100 }}>
          Visão Geral
        </Box>
      </Typography>
      <Divider sx={{ my: 1, borderColor: theme.palette.divider }} />
      <Typography sx={{ my: 3 }} variant="h6" color="textSecondary">
        Eventos
      </Typography>
      {isLoading ? (
        <Typography color="textSecondary" align="center">
          Carregando eventos...
        </Typography>
      ) : Object.keys(eventsByCategory).length === 0 ? (
        <Typography color="textSecondary" align="center">
          Nenhum evento encontrado.
        </Typography>
      ) : (
        // Mapeie sobre os IDs das categorias para garantir a ordem e a exibição correta
        categories.map((category) => {
          const categorizedEvents = eventsByCategory[category.id] || []; // 👈 Pega os eventos da categoria, se existirem

          // Renderize o acordeão apenas se houver eventos para a categoria
          if (categorizedEvents.length > 0) {
            return (
              <Accordion
                key={category.id}
                expanded={expanded === category.id.toString()}
                onChange={handleAccordionChange(category.id.toString())}
                sx={{ mb: 2 }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel-${category.id}-content`}
                  id={`panel-${category.id}-header`}
                >
                  <Typography variant="h6" color="textPrimary">
                    {category.name}
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
                    {categorizedEvents.map((event) => (
                      <AnalyticsEventCard key={event.id} event={adaptEvent(event)} />
                    ))}
                  </Box>
                </AccordionDetails>
              </Accordion>
            );
          }
          return null;
        })
      )}
    </Box>
  );
}

export default Analytics;

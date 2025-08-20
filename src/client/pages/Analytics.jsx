import EventCard from '../components/card/EventCard';
import { Typography, Divider, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

function Analytics() {
  const theme = useTheme();

  const myEventData = [
    // Seus dados de evento...
    {
      id: 1,
      name: 'XX Campeonato Brasileiro Sub-23',
      description: 'Fase Classificatoria',
      date: '2025-08-25T19:00:00.000Z',
      location: 'Campo Municipal Mie Nishie',
      type: 'CHAMPIONSHIP',
      teamId: 1,
      team: { id: 1, name: 'Gecebs' },
      confirmations: [
        {
          id: 1,
          name: 'Confirmação Presença',
          eventId: 1,
          event: null,
          confirmedBy: [
            {
              confirmationId: 1,
              userId: 10,
              confirmedAt: '2025-08-23T12:30:00.000Z',
              user: { id: 10, name: 'Gustavo Kamitani', email: 'gustavo@email.com' },
            },
            {
              confirmationId: 2,
              userId: 11,
              confirmedAt: null,
              user: { id: 11, name: 'Carlos Silva', email: 'carlos@email.com' },
            },
          ],
        },
      ],
    },
    {
      id: 2,
      name: 'Treino Extra 1',
      description: 'Treino focado em arremessos',
      date: '2025-08-27T19:00:00.000Z',
      location: 'Campo Municipal Mie Nishie',
      type: 'TRAINING',
      teamId: 1,
      team: { id: 1, name: 'Gecebs' },
      confirmations: [
        {
          id: 2,
          name: 'Confirmação Presença',
          eventId: 2,
          event: null,
          confirmedBy: [
            {
              confirmationId: 3,
              userId: 10,
              confirmedAt: '2025-08-23T12:30:00.000Z',
              user: { id: 10, name: 'Gustavo Kamitani', email: 'gustavo@email.com' },
            },
          ],
        },
      ],
    },
    {
      id: 3,
      name: 'Treino Extra 2',
      description: 'Treino focado em arremessos',
      date: '2025-08-27T19:00:00.000Z',
      location: 'Campo Municipal Mie Nishie',
      type: 'TRAINING',
      teamId: 1,
      team: { id: 1, name: 'Gecebs' },
      confirmations: [
        {
          id: 3,
          name: 'Confirmação Presença',
          eventId: 3,
          event: null,
          confirmedBy: [
            {
              confirmationId: 4,
              userId: 10,
              confirmedAt: '2025-08-23T12:30:00.000Z',
              user: { id: 10, name: 'Gustavo Kamitani', email: 'gustavo@email.com' },
            },
          ],
        },
      ],
    },
    {
      id: 4,
      name: 'Treino Extra 3',
      description: 'Treino focado em arremessos',
      date: '2025-08-27T19:00:00.000Z',
      location: 'Campo Municipal Mie Nishie',
      type: 'TRAINING',
      teamId: 1,
      team: { id: 1, name: 'Gecebs' },
      confirmations: [
        {
          id: 4,
          name: 'Confirmação Presença',
          eventId: 4,
          event: null,
          confirmedBy: [
            {
              confirmationId: 5,
              userId: 10,
              confirmedAt: '2025-08-23T12:30:00.000Z',
              user: { id: 10, name: 'Gustavo Kamitani', email: 'gustavo@email.com' },
            },
          ],
        },
      ],
    },
  ];

  const adaptEvent = (event) => {
    const confirmedAthletes = [];
    const unconfirmedAthletes = [];

    event.confirmations.forEach((confirmation) => {
      confirmation.confirmedBy.forEach((entry) => {
        if (entry.confirmedAt) {
          confirmedAthletes.push({ id: entry.user.id, name: entry.user.name });
        } else {
          unconfirmedAthletes.push({ id: entry.user.id, name: entry.user.name });
        }
      });
    });

    return {
      id: event.id,
      name: event.name,
      description: event.description,
      date: event.date,
      location: event.location,
      type: event.type,
      confirmedAthletes,
      unconfirmedAthletes,
    };
  };

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
        {myEventData.map((event) => (
          <EventCard key={event.id} event={adaptEvent(event)} />
        ))}
      </Box>
    </Box>
  );
}

export default Analytics;

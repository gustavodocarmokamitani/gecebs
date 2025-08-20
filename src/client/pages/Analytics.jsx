import EventCard from '../components/card/EventCard';
import { Typography, Divider, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

function Analytics() {
  const theme = useTheme();

  const events = [
    {
      id: 1,
      name: 'XX Campeonato Brasileiro Sub-23',
      description: 'Fase Classificatória',
      date: '2025-08-25T19:00:00.000Z',
      location: 'Campo Municipal Mie Nishie',
      type: 'CHAMPIONSHIP',
      teamId: 1,
      confirmations: [
        {
          id: 1,
          createdAt: '2025-08-20T12:00:00.000Z',
          confirmedBy: [
            {
              userId: 1,
              user: { id: 1, firstName: 'Gustavo', lastName: 'Kamitani' },
              status: true,
              confirmedAt: '2025-08-23T12:00:00.000Z',
            },
            {
              userId: 2,
              user: { id: 2, firstName: 'Carlos', lastName: 'Silva' },
              status: true,
              confirmedAt: '2025-08-23T12:05:00.000Z',
            },
            {
              userId: 3,
              user: { id: 3, firstName: 'Ana', lastName: 'Pereira' },
              status: true,
              confirmedAt: '2025-08-23T12:10:00.000Z',
            },
            {
              userId: 4,
              user: { id: 4, firstName: 'Beatriz', lastName: 'Costa' },
              status: true,
              confirmedAt: '2025-08-23T12:15:00.000Z',
            },
            {
              userId: 5,
              user: { id: 5, firstName: 'Felipe', lastName: 'Santos' },
              status: true,
              confirmedAt: '2025-08-23T12:20:00.000Z',
            },
            {
              userId: 6,
              user: { id: 6, firstName: 'Mariana', lastName: 'Lima' },
              status: false,
              confirmedAt: null,
            },
            {
              userId: 7,
              user: { id: 7, firstName: 'Rodrigo', lastName: 'Alves' },
              status: false,
              confirmedAt: null,
            },
            {
              userId: 8,
              user: { id: 8, firstName: 'Juliana', lastName: 'Martins' },
              status: false,
              confirmedAt: null,
            },
            {
              userId: 9,
              user: { id: 9, firstName: 'Pedro', lastName: 'Gomes' },
              status: false,
              confirmedAt: null,
            },
            {
              userId: 10,
              user: { id: 10, firstName: 'Larissa', lastName: 'Ribeiro' },
              status: false,
              confirmedAt: null,
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
      confirmations: [
        {
          id: 2,
          createdAt: '2025-08-21T12:00:00.000Z',
          confirmedBy: [
            {
              userId: 1,
              user: { id: 1, firstName: 'Gustavo', lastName: 'Kamitani' },
              status: true,
              confirmedAt: '2025-08-24T12:00:00.000Z',
            },
            {
              userId: 2,
              user: { id: 2, firstName: 'Carlos', lastName: 'Silva' },
              status: true,
              confirmedAt: '2025-08-24T12:05:00.000Z',
            },
            {
              userId: 3,
              user: { id: 3, firstName: 'Ana', lastName: 'Pereira' },
              status: true,
              confirmedAt: '2025-08-24T12:10:00.000Z',
            },
            {
              userId: 4,
              user: { id: 4, firstName: 'Beatriz', lastName: 'Costa' },
              status: true,
              confirmedAt: '2025-08-24T12:15:00.000Z',
            },
            {
              userId: 5,
              user: { id: 5, firstName: 'Felipe', lastName: 'Santos' },
              status: true,
              confirmedAt: '2025-08-24T12:20:00.000Z',
            },
            {
              userId: 6,
              user: { id: 6, firstName: 'Mariana', lastName: 'Lima' },
              status: false,
              confirmedAt: null,
            },
            {
              userId: 7,
              user: { id: 7, firstName: 'Rodrigo', lastName: 'Alves' },
              status: false,
              confirmedAt: null,
            },
            {
              userId: 8,
              user: { id: 8, firstName: 'Juliana', lastName: 'Martins' },
              status: false,
              confirmedAt: null,
            },
            {
              userId: 9,
              user: { id: 9, firstName: 'Pedro', lastName: 'Gomes' },
              status: false,
              confirmedAt: null,
            },
            {
              userId: 10,
              user: { id: 10, firstName: 'Larissa', lastName: 'Ribeiro' },
              status: false,
              confirmedAt: null,
            },
          ],
        },
      ],
    },
    {
      id: 3,
      name: 'Treino Extra 2',
      description: 'Treino focado em arremessos',
      date: '2025-08-28T19:00:00.000Z',
      location: 'Campo Municipal Mie Nishie',
      type: 'TRAINING',
      teamId: 1,
      confirmations: [
        {
          id: 3,
          createdAt: '2025-08-22T12:00:00.000Z',
          confirmedBy: [
            {
              userId: 1,
              user: { id: 1, firstName: 'Gustavo', lastName: 'Kamitani' },
              status: true,
              confirmedAt: '2025-08-25T12:00:00.000Z',
            },
            {
              userId: 2,
              user: { id: 2, firstName: 'Carlos', lastName: 'Silva' },
              status: true,
              confirmedAt: '2025-08-25T12:05:00.000Z',
            },
            {
              userId: 3,
              user: { id: 3, firstName: 'Ana', lastName: 'Pereira' },
              status: true,
              confirmedAt: '2025-08-25T12:10:00.000Z',
            },
            {
              userId: 4,
              user: { id: 4, firstName: 'Beatriz', lastName: 'Costa' },
              status: true,
              confirmedAt: '2025-08-25T12:15:00.000Z',
            },
            {
              userId: 5,
              user: { id: 5, firstName: 'Felipe', lastName: 'Santos' },
              status: true,
              confirmedAt: '2025-08-25T12:20:00.000Z',
            },
            {
              userId: 6,
              user: { id: 6, firstName: 'Mariana', lastName: 'Lima' },
              status: false,
              confirmedAt: null,
            },
            {
              userId: 7,
              user: { id: 7, firstName: 'Rodrigo', lastName: 'Alves' },
              status: false,
              confirmedAt: null,
            },
            {
              userId: 8,
              user: { id: 8, firstName: 'Juliana', lastName: 'Martins' },
              status: false,
              confirmedAt: null,
            },
            {
              userId: 9,
              user: { id: 9, firstName: 'Pedro', lastName: 'Gomes' },
              status: false,
              confirmedAt: null,
            },
            {
              userId: 10,
              user: { id: 10, firstName: 'Larissa', lastName: 'Ribeiro' },
              status: false,
              confirmedAt: null,
            },
          ],
        },
      ],
    },
    {
      id: 4,
      name: 'Treino Extra 3',
      description: 'Treino de fundamentos',
      date: '2025-08-29T19:00:00.000Z',
      location: 'Campo Municipal Mie Nishie',
      type: 'TRAINING',
      teamId: 1,
      confirmations: [
        {
          id: 4,
          createdAt: '2025-08-23T12:00:00.000Z',
          confirmedBy: [
            {
              userId: 1,
              user: { id: 1, firstName: 'Gustavo', lastName: 'Kamitani' },
              status: true,
              confirmedAt: '2025-08-26T12:00:00.000Z',
            },
            {
              userId: 2,
              user: { id: 2, firstName: 'Carlos', lastName: 'Silva' },
              status: true,
              confirmedAt: '2025-08-26T12:05:00.000Z',
            },
            {
              userId: 3,
              user: { id: 3, firstName: 'Ana', lastName: 'Pereira' },
              status: true,
              confirmedAt: '2025-08-26T12:10:00.000Z',
            },
            {
              userId: 4,
              user: { id: 4, firstName: 'Beatriz', lastName: 'Costa' },
              status: true,
              confirmedAt: '2025-08-26T12:15:00.000Z',
            },
            {
              userId: 5,
              user: { id: 5, firstName: 'Felipe', lastName: 'Santos' },
              status: true,
              confirmedAt: '2025-08-26T12:20:00.000Z',
            },
            {
              userId: 6,
              user: { id: 6, firstName: 'Mariana', lastName: 'Lima' },
              status: false,
              confirmedAt: null,
            },
            {
              userId: 7,
              user: { id: 7, firstName: 'Rodrigo', lastName: 'Alves' },
              status: false,
              confirmedAt: null,
            },
            {
              userId: 8,
              user: { id: 8, firstName: 'Juliana', lastName: 'Martins' },
              status: false,
              confirmedAt: null,
            },
            {
              userId: 9,
              user: { id: 9, firstName: 'Pedro', lastName: 'Gomes' },
              status: false,
              confirmedAt: null,
            },
            {
              userId: 10,
              user: { id: 10, firstName: 'Larissa', lastName: 'Ribeiro' },
              status: false,
              confirmedAt: null,
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
    });

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
        {events.map((event) => (
          <EventCard key={event.id} event={adaptEvent(event)} />
        ))}
      </Box>
    </Box>
  );
}

export default Analytics;

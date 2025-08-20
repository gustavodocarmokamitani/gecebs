import EventCard from '../components/card/EventCard';
import { Typography, Divider, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

function Athlete() {
  const theme = useTheme();

  const atletas = [
    {
      id: 1,
      firstName: 'Lucas',
      lastName: 'Silva',
      phone: '11999999999',
      federationId: 'FED001',
      birthDate: new Date('2000-05-15'),
      shirtNumber: '10',
      userId: 101,
    },
    {
      id: 2,
      firstName: 'Mariana',
      lastName: 'Oliveira',
      phone: '11988888888',
      federationId: 'FED002',
      birthDate: new Date('1998-10-20'),
      shirtNumber: '7',
      userId: 102,
    },
    {
      id: 3,
      firstName: 'Pedro',
      lastName: 'Santos',
      phone: '11977777777',
      federationId: 'FED003',
      birthDate: new Date('2002-03-08'),
      shirtNumber: '5',
      userId: 103,
    },
    {
      id: 4,
      firstName: 'Ana',
      lastName: 'Costa',
      phone: '11966666666',
      federationId: 'FED004',
      birthDate: new Date('1999-12-25'),
      shirtNumber: '9',
      userId: 104,
    },
    {
      id: 5,
      firstName: 'Rafael',
      lastName: 'Lima',
      phone: '11955555555',
      federationId: 'FED005',
      birthDate: new Date('2001-07-11'),
      shirtNumber: '8',
      userId: 105,
    },
  ];

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
        {atletas.map((event) => (
          <AthleteCard key={event.id} event={adaptEvent(event)} />
        ))}
      </Box>
    </Box>
  );
}

export default Athlete;

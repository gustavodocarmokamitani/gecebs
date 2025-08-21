import react, { useState, useEffect } from 'react';
import AthleteCard from '../components/card/AthleteCard';
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
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import { useResponsive } from '../hooks/useResponsive';
import CustomButton from '../components/common/CustomButton';
import CustomInput from '../components/common/CustomInput';
import { useNavigate } from 'react-router-dom';

const atletas = [
  {
    id: 1,
    firstName: 'Lucas',
    lastName: 'Silva',
    phone: '11999999999',
    federationId: 'FED001',
    birthDate: '2000-05-15T00:00:00.000Z',
    shirtNumber: '10',
    userId: 101,
    categories: [
      {
        categoryId: 1,
      },
      {
        categoryId: 2,
      },
    ],
  },
  {
    id: 2,
    firstName: 'Mariana',
    lastName: 'Oliveira',
    phone: '11988888888',
    federationId: 'FED002',
    birthDate: '1998-10-20T00:00:00.000Z',
    shirtNumber: '7',
    userId: 102,
    categories: [
      {
        categoryId: 1,
      },
    ],
  },
  {
    id: 3,
    firstName: 'Pedro',
    lastName: 'Santos',
    phone: '11977777777',
    federationId: 'FED003',
    birthDate: '2002-03-08T00:00:00.000Z',
    shirtNumber: '5',
    userId: 103,
    categories: [
      {
        categoryId: 2,
      },
      {
        categoryId: 3,
      },
    ],
  },
  {
    id: 4,
    firstName: 'Ana',
    lastName: 'Costa',
    phone: '11966666666',
    federationId: 'FED004',
    birthDate: '1999-12-25T00:00:00.000Z',
    shirtNumber: '9',
    userId: 104,
    categories: [
      {
        categoryId: 3,
      },
    ],
  },
  {
    id: 5,
    firstName: 'Rafael',
    lastName: 'Lima',
    phone: '11955555555',
    federationId: 'FED005',
    birthDate: '2001-07-11T00:00:00.000Z',
    shirtNumber: '8',
    userId: 105,
    categories: [
      {
        categoryId: 1,
      },
      {
        categoryId: 3,
      },
    ],
  },
];

function Athlete() {
  const theme = useTheme();

  const deviceType = useResponsive();
  const isMobile = deviceType === 'mobile' || deviceType === 'tablet';
  const navigate = useNavigate();

  const [groupedAthletes, setGroupedAthletes] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [expanded, setExpanded] = useState(false);

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  useEffect(() => {
    const groupAthletesByCategory = (athletes) => {
      const groups = {};
      athletes.forEach((athlete) => {
        athlete.categories.forEach((cat) => {
          const categoryId = cat.categoryId;
          if (!groups[categoryId]) {
            groups[categoryId] = [];
          }
          groups[categoryId].push(athlete);
        });
      });
      return groups;
    };

    const filteredAthletes = atletas.filter(
      (athlete) =>
        athlete.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        athlete.lastName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setGroupedAthletes(groupAthletesByCategory(filteredAthletes));
  }, [searchTerm]);

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

  const handleAddAthleteClick = () => {
    navigate('/athlete/new');
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
          Gestão de Atletas
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
          onClick={handleAddAthleteClick}
          sx={{ mr: isMobile ? 0 : 5 }}
        >
          Adicionar Atleta
        </CustomButton>
      </Box>
      <Divider sx={{ my: 2, borderColor: theme.palette.divider }} />
      <Box sx={{ mt: 2, mb: 4, mr: isMobile ? 0 : 5 }}>
        <CustomInput
          label="Buscar Atleta"
          placeholder="Digite o nome do atleta"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>

      <Typography sx={{ my: 3 }} variant="h6" color="textSecondary">
        Atletas
      </Typography>
      {Object.keys(groupedAthletes).map((categoryId, index) => {
        const athletesInGroup = groupedAthletes[categoryId];
        if (athletesInGroup.length === 0) return null;

        return (
          <Accordion
            key={categoryId}
            expanded={expanded === categoryId}
            onChange={handleAccordionChange(categoryId)}
            sx={{
              mb: 2,
              '&::before': {
                display: 'none',
                background: 'red',
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
                {athletesInGroup.map((athlete) => (
                  <AthleteCard key={athlete.id} event={athlete} />
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Box>
  );
}

export default Athlete;

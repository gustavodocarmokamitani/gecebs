import react, { useState, useEffect } from 'react';
import AthleteCard from '../components/card/AthleteCard';
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
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import { useResponsive } from '../hooks/useResponsive';
import CustomButton from '../components/common/CustomButton';
import CustomInput from '../components/common/CustomInput';
import { useNavigate } from 'react-router-dom';
import CategoryService from '../services/Category';
import AthleteService from '../services/Athlete';
import { toast } from 'react-toastify';

function Athlete() {
  const theme = useTheme();

  const deviceType = useResponsive();
  const isMobile = deviceType === 'mobile' || deviceType === 'tablet';
  const navigate = useNavigate();

  // 👈 Substituindo o mock por estados
  const [athletes, setAthletes] = useState([]);
  const [categories, setCategories] = useState([]); // Novo estado para as categorias
  const [groupedAthletes, setGroupedAthletes] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const groupAthletesByCategory = (allCategories, athletesToGroup) => {
    const groups = {};
    // Inicializa os grupos com as categorias conhecidas
    allCategories.forEach((cat) => {
      groups[cat.id] = {
        name: cat.name,
        athletes: [],
      };
    });

    athletesToGroup.forEach((athlete) => {
      athlete.categories.forEach((cat) => {
        const categoryId = cat.category.id;
        if (groups[categoryId]) {
          groups[categoryId].athletes.push(athlete);
        }
      });
    });
    return groups;
  };

  const fetchAthletesAndCategories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // 👈 Buscando atletas e categorias em paralelo
      const [fetchedAthletes, fetchedCategories] = await Promise.all([
        AthleteService.list(),
        CategoryService.getAll(),
      ]);
      setAthletes(fetchedAthletes);
      setCategories(fetchedCategories);
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
      setError('Erro ao carregar os dados. Tente novamente mais tarde.');
      toast.error('Erro ao carregar os dados.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAthletesAndCategories();
  }, []);

  useEffect(() => {
    if (athletes.length > 0 && categories.length > 0) {
      const filteredAthletes = athletes.filter(
        (athlete) =>
          athlete.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          athlete.lastName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setGroupedAthletes(groupAthletesByCategory(categories, filteredAthletes));
    } else if (athletes.length === 0 && categories.length > 0) {
      // Caso não haja atletas, mas há categorias, inicializa os grupos vazios
      const emptyGroups = {};
      categories.forEach((cat) => {
        emptyGroups[cat.id] = {
          name: cat.name,
          athletes: [],
        };
      });
      setGroupedAthletes(emptyGroups);
    } else if (!isLoading && !error) {
      // Se não está carregando e não há erro, mas não há dados
      setGroupedAthletes({});
    }
  }, [athletes, categories, searchTerm]);

  const handleAddAthleteClick = () => {
    navigate('/athlete/new');
  };

  // Funções de edição e exclusão (ajustadas para usar a API)
  const handleEdit = (id) => {
    navigate(`/athlete/edit/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este atleta?')) {
      try {
        await AthleteService.remove(id);
        toast.success('Atleta excluído com sucesso!');
        fetchAthletesAndCategories(); // Recarrega os dados após a exclusão
      } catch (err) {
        console.error('Erro ao excluir atleta:', err);
        toast.error('Erro ao excluir o atleta.');
      }
    }
  };

  return (
    <Box>
      {/* ... (cabeçalho, divider e input de busca) */}
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

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" align="center">
          {error}
        </Typography>
      ) : Object.keys(groupedAthletes).length === 0 ? (
        <Typography color="text.secondary" align="center">
          Nenhum atleta encontrado.
        </Typography>
      ) : (
        Object.keys(groupedAthletes).map((categoryId, index) => {
          const group = groupedAthletes[categoryId];

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
                  {group.athletes.map((athlete) => (
                    <AthleteCard
                      key={athlete.id}
                      athlete={athlete}
                      onEdit={() => handleEdit(athlete.id)}
                      onDelete={() => handleDelete(athlete.id)}
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

export default Athlete;

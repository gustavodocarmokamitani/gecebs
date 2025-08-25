// src/pages/Athlete.jsx

import React, { useState, useEffect } from 'react';
import AthleteCard from '../components/card/AthleteCard';
import {
  Typography,
  Divider,
  Box,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog, // Adicionado
  DialogTitle, // Adicionado
  DialogContent, // Adicionado
  DialogContentText, // Adicionado
  DialogActions, // Adicionado
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

  const [athletes, setAthletes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [groupedAthletes, setGroupedAthletes] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);

  // Estados para o modal de confirmação
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [athleteIdToDelete, setAthleteIdToDelete] = useState(null);

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const groupAthletesByCategory = (allCategories, athletesToGroup) => {
    const groups = {};
    const noCategoryKey = 'no-category-group';

    allCategories.forEach((cat) => {
      groups[cat.id] = {
        name: cat.name,
        athletes: [],
      };
    });

    groups[noCategoryKey] = {
      name: 'Sem Categoria',
      athletes: [],
    };

    athletesToGroup.forEach((athlete) => {
      if (athlete.categories && athlete.categories.length > 0) {
        athlete.categories.forEach((cat) => {
          const categoryId = cat.category.id;
          if (groups[categoryId]) {
            groups[categoryId].athletes.push(athlete);
          }
        });
      } else {
        groups[noCategoryKey].athletes.push(athlete);
      }
    });

    return groups;
  };

  const fetchAthletesAndCategories = async () => {
    setIsLoading(true);
    setError(null);
    try {
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
    const filteredAthletes = athletes.filter(
      (athlete) =>
        athlete.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        athlete.lastName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (athletes.length > 0) {
      setGroupedAthletes(groupAthletesByCategory(categories, filteredAthletes));
    } else {
      setGroupedAthletes({});
    }
  }, [athletes, categories, searchTerm]);

  const handleAddAthleteClick = () => {
    navigate('/athlete/new');
  };

  const handleEdit = (id) => {
    navigate(`/athlete/edit/${id}`);
  };

  // Funções para controlar o modal de confirmação
  const handleOpenDeleteDialog = (id) => {
    setAthleteIdToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setAthleteIdToDelete(null);
  };

  const handleConfirmDelete = async () => {
    handleCloseDeleteDialog();
    if (athleteIdToDelete) {
      try {
        await AthleteService.remove(athleteIdToDelete);
        toast.success('Atleta excluído com sucesso!');
        fetchAthletesAndCategories();
      } catch (err) {
        console.error('Erro ao excluir atleta:', err);
        toast.error('Erro ao excluir o atleta.');
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

          if (group.athletes.length === 0) {
            return null;
          }

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
                  {group.athletes.map((athlete) => (
                    <AthleteCard
                      key={athlete.id}
                      athlete={athlete}
                      onEdit={() => handleEdit(athlete.id)}
                      onDelete={() => handleOpenDeleteDialog(athlete.id)}
                    />
                  ))}
                </Box>
              </AccordionDetails>
            </Accordion>
          );
        })
      )}

      {/* Diálogo de confirmação de exclusão */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Atenção: Ação Irreversível'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Ao excluir este atleta, o perfil será removido permanentemente, juntamente com todas as
            suas informações e associações a categorias.
            <br />
            <br />
            Esta ação é irreversível. Tem certeza que deseja continuar?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <CustomButton onClick={handleCloseDeleteDialog} variant="contained">
            Cancelar
          </CustomButton>
          <CustomButton onClick={handleConfirmDelete} variant="contained" color="error" autoFocus>
            Confirmar Exclusão
          </CustomButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Athlete;

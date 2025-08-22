// src/pages/Manager.jsx
import React, { useState, useEffect } from 'react';
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
import ManagerCard from '../components/card/ManagerCard';
import { useNavigate } from 'react-router-dom';
import ManagerService from '../services/Manager';
import { toast } from 'react-toastify';

const Manager = () => {
  const theme = useTheme();
  const deviceType = useResponsive();
  const isMobile = deviceType === 'mobile' || deviceType === 'tablet';
  const navigate = useNavigate();

  const [managers, setManagers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const fetchManagers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedManagers = [
        {
          id: 1,
          firstName: 'João',
          lastName: 'Sousa',
          phone: '11999999999',
          userId: 101,
          categories: [
            { category: { id: 1, name: 'Adulto' } },
            { category: { id: 2, name: 'Sub-23' } },
            { category: { id: 3, name: 'Juvenil' } },
            { category: { id: 4, name: 'Junior' } },
          ],
        },
        {
          id: 2,
          firstName: 'Carlos',
          lastName: 'Mota',
          phone: '11988888888',
          userId: 102,
          categories: [{ category: { id: 1, name: 'Adulto' } }],
        },
        {
          id: 3,
          firstName: 'Marta',
          lastName: 'Ferreira',
          phone: '11977777777',
          userId: 103,
          categories: [{ category: { id: 3, name: 'Juvenil' } }],
        },
      ];
      setManagers(fetchedManagers);
    } catch (err) {
      console.error('Erro ao buscar managers:', err);
      setError('Erro ao carregar a lista de managers.');
      toast.error('Erro ao carregar a lista de managers.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchManagers();
  }, []);

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleAddManagerClick = () => {
    navigate('/manager/new');
  };

  const handleDeleteManagerClick = async (managerId) => {
    const isConfirmed = window.confirm('Tem certeza de que deseja excluir este manager?');
    if (isConfirmed) {
      try {
        await ManagerService.delete(managerId);
        setManagers(managers.filter((manager) => manager.id !== managerId));
        toast.success('Manager excluído com sucesso.');
      } catch (err) {
        console.error('Erro ao excluir manager:', err);
        toast.error('Erro ao excluir manager.');
      }
    }
  };

  // Agrupar os managers por categoria
  const groupedManagers = managers.reduce((groups, manager) => {
    manager.categories.forEach((cat) => {
      const categoryId = cat.category.id;
      const categoryName = cat.category.name;
      if (!groups[categoryId]) {
        groups[categoryId] = {
          name: categoryName,
          managers: [],
        };
      }
      groups[categoryId].managers.push(manager);
    });
    return groups;
  }, {});

  const filteredGroupedManagers = Object.keys(groupedManagers).reduce((filtered, categoryId) => {
    const group = groupedManagers[categoryId];
    const filteredManagersInGroup = group.managers.filter(
      (manager) =>
        manager.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        manager.lastName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filteredManagersInGroup.length > 0) {
      filtered[categoryId] = {
        name: group.name,
        managers: filteredManagersInGroup,
      };
    }
    return filtered;
  }, {});

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
          Gestão de Managers
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
          onClick={handleAddManagerClick}
          sx={{ mr: isMobile ? 0 : 5 }}
        >
          Adicionar Manager
        </CustomButton>
      </Box>
      <Divider sx={{ my: 2, borderColor: theme.palette.divider }} />
      <Box sx={{ mt: 2, mb: 4, mr: isMobile ? 0 : 5 }}>
        <CustomInput
          label="Buscar Manager"
          placeholder="Digite o nome do manager"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" align="center">
          {error}
        </Typography>
      ) : Object.keys(filteredGroupedManagers).length === 0 ? (
        <Typography color="text.secondary" align="center">
          Nenhum manager encontrado.
        </Typography>
      ) : (
        Object.keys(filteredGroupedManagers).map((categoryId) => {
          const group = filteredGroupedManagers[categoryId];
          return (
            <Accordion
              key={categoryId}
              expanded={expanded === categoryId}
              onChange={handleAccordionChange(categoryId)}
              sx={{ mb: 2 }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel-${categoryId}-content`}
                id={`panel-${categoryId}-header`}
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
                  {group.managers.map((manager) => (
                    <ManagerCard
                      key={manager.id}
                      manager={manager}
                      onDelete={handleDeleteManagerClick}
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
};

export default Manager;

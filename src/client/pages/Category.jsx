// src/pages/Category.jsx

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
// 👈 Importando o serviço real
import CategoryService from '../services/Category';
import { toast } from 'react-toastify';
import CustomButton from '../components/common/CustomButton';
import CategoryCard from '../components/card/CategoryCard';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import { useTheme } from '@mui/material/styles';
import { useResponsive } from '../hooks/useResponsive';

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState(null); // Adiciona estado de erro
  const navigate = useNavigate();
  const theme = useTheme();
  const deviceType = useResponsive();
  const isMobile = deviceType === 'mobile' || deviceType === 'tablet';

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  // 1. Função de busca que agora usa a API
  const fetchCategories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedCategories = await CategoryService.getAll();
      setCategories(fetchedCategories);
    } catch (err) {
      console.error('Erro ao buscar categorias:', err);
      setError('Erro ao carregar a lista de categorias.');
      toast.error('Erro ao carregar a lista de categorias.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleEdit = (id) => {
    navigate(`/category/edit/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta categoria?')) {
      try {
        await CategoryService.remove(id); // Chama o serviço de API para remover
        fetchCategories(); // Recarrega a lista após a exclusão
        toast.success('Categoria excluída com sucesso!');
      } catch (err) {
        console.error('Erro ao excluir categoria:', err);
        toast.error('Erro ao excluir categoria.');
      }
    }
  };

  const handleAddCategoryClick = () => {
    navigate('/category/new');
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
          Gestão de Categorias
          <span>
            <ChevronRightIcon sx={{ mt: 1.5 }} />
          </span>
          <Box component="span" color="primary.main" sx={{ fontWeight: 100 }}>
            Visão Geral
          </Box>
        </Typography>
        <CustomButton variant="contained" startIcon={<AddIcon />} onClick={handleAddCategoryClick}>
          Adicionar Categoria
        </CustomButton>
      </Box>

      <Divider sx={{ my: 2, borderColor: theme.palette.divider }} />

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography variant="body1" color="error" sx={{ mt: 4, textAlign: 'center' }}>
          {error}
        </Typography>
      ) : categories.length === 0 ? (
        <Typography variant="body1" color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
          Nenhuma categoria encontrada.
        </Typography>
      ) : (
        <Accordion
          expanded={expanded === 'all-categories'}
          onChange={handleAccordionChange('all-categories')}
          sx={{ mb: 2 }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel-all-categories-content"
            id="panel-all-categories-header"
          >
            <Typography variant="h6" color="textPrimary">
              Todas as Categorias
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                alignItems: 'center',
              }}
            >
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>
      )}
    </Box>
  );
};

export default Category;

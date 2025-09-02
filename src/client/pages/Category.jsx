import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  CircularProgress,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { toast } from 'react-toastify';
import { useTheme } from '@mui/material/styles';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import { useResponsive } from '../hooks/useResponsive';
import CategoryService from '../services/Category';
import CustomButton from '../components/common/CustomButton';
import CategoryCard from '../components/card/CategoryCard';

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expanded, setExpanded] = useState('all-categories');
  const [error, setError] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [categoryIdToDelete, setCategoryIdToDelete] = useState(null);

  const navigate = useNavigate();
  const theme = useTheme();
  const deviceType = useResponsive();
  const isMobile = deviceType === 'mobile' || deviceType === 'tablet';

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

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

  const handleOpenDeleteDialog = (id) => {
    setCategoryIdToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setCategoryIdToDelete(null);
  };

  const handleConfirmDelete = async () => {
    handleCloseDeleteDialog();
    if (categoryIdToDelete) {
      try {
        await CategoryService.remove(categoryIdToDelete);
        fetchCategories();
        toast.success('Categoria excluída com sucesso!');
      } catch (err) {
        console.error('Erro ao excluir categoria:', err);
        toast.error(err.response?.data?.message || 'Erro ao salvar categoria.');
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
                flexDirection: isMobile ? 'column' : 'row',
                flexWrap: isMobile ? 'nowrap' : 'wrap',
                gap: 2,
                alignItems: 'center',
                justifyContent: isMobile ? 'center' : 'start',
                ...(isMobile && {
                  overflowX: 'hidden',
                }),
              }}
            >
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  onEdit={handleEdit}
                  onDelete={() => handleOpenDeleteDialog(category.id)}
                />
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>
      )}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Atenção: Ação Irreversível'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Ao excluir esta categoria, você também irá deletar todos os dados associados a ela:
            **associações de managers e atletas**, além de todos os **eventos e pagamentos**
            vinculados.
            <br />
            <br />
            Esta ação não pode ser desfeita. Tem certeza que deseja continuar?
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
};

export default Category;

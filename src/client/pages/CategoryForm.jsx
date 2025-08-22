// src/pages/CategoryForm.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Divider, CircularProgress } from '@mui/material';
import CustomInput from '../components/common/CustomInput';
import CustomButton from '../components/common/CustomButton';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useTheme } from '@mui/material/styles';
import { useResponsive } from '../hooks/useResponsive';
import CategoryService from '../services/Category';
import { toast } from 'react-toastify';

const CategoryForm = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const deviceType = useResponsive();
  const isMobile = deviceType === 'mobile' || deviceType === 'tablet';

  const isEditing = !!categoryId;

  const [formData, setFormData] = useState({ name: '' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isEditing) {
      const fetchCategory = async () => {
        setIsLoading(true);
        try {
          const categoryToEdit = await CategoryService.getById(categoryId);
          setFormData({ name: categoryToEdit.name });
        } catch (err) {
          console.error('Erro ao buscar categoria:', err);
          toast.error('Categoria não encontrada.');
          navigate('/category');
        } finally {
          setIsLoading(false);
        }
      };
      fetchCategory();
    }
  }, [categoryId, isEditing, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error('O nome da categoria é obrigatório.');
      return;
    }

    setIsLoading(true);
    try {
      if (isEditing) {
        // Lógica de edição
        await CategoryService.update(categoryId, formData);
        toast.success('Categoria atualizada com sucesso!');
      } else {
        // Lógica de criação
        await CategoryService.create(formData);
        toast.success('Categoria criada com sucesso!');
      }
      navigate('/category');
    } catch (err) {
      console.error('Erro ao salvar categoria:', err);
      toast.error(err.response?.data?.message || 'Erro ao salvar categoria.');
    } finally {
      setIsLoading(false);
    }
  };

  const title = isEditing ? 'Editar Categoria' : 'Adicionar Categoria';

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
          <Box
            component="span"
            onClick={() => navigate('/category')}
            sx={{
              cursor: 'pointer',
              '&:hover': {
                color: theme.palette.primary.main,
              },
            }}
          >
            Visão Geral
          </Box>
          <span>
            <ChevronRightIcon sx={{ mt: 1.5 }} />
          </span>
          <Box component="span" color="primary.main" sx={{ fontWeight: 100 }}>
            {title}
          </Box>
        </Typography>
      </Box>

      <Divider sx={{ my: 2, borderColor: theme.palette.divider }} />

      <Typography sx={{ my: 3 }} variant="h6" color="textSecondary">
        Dados da Categoria
      </Typography>

      {isLoading && isEditing ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, maxWidth: 500 }}>
          <CustomInput
            label="Nome da Categoria"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
          <CustomButton
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Salvar'}
          </CustomButton>
        </Box>
      )}
    </Box>
  );
};

export default CategoryForm;

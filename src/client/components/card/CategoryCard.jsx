// src/components/card/CategoryCard.jsx

import React from 'react';
import { Card, CardContent, Typography, Box, IconButton } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const CategoryCard = ({ category, onEdit, onDelete }) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        width: '100%',
        maxWidth: 250,
        margin: 1,
        borderRadius: '12px',
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        border: `1px solid ${theme.palette.divider}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        p: 1.5,
      }}
    >
      <CardContent sx={{ flexGrow: 1, px: 0, '&:last-child': { pb: 0 } }}>
        <Typography variant="p" component="div" sx={{ fontWeight: 'bold' }}>
          {category.name}
        </Typography>
      </CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton
          aria-label="editar"
          onClick={() => onEdit(category.id)}
          sx={{ color: theme.palette.primary.main }}
        >
          <EditIcon />
        </IconButton>
        <IconButton
          aria-label="excluir"
          onClick={() => onDelete(category.id)}
          sx={{ color: theme.palette.error.main }}
        >
          <DeleteIcon />
        </IconButton>
      </Box>
    </Card>
  );
};

export default CategoryCard;

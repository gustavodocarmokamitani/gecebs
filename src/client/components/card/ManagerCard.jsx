// src/components/card/ManagerCard.jsx
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  List,
  ListItem,
  ListItemText,
  Collapse,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTheme } from '@mui/material/styles';
import { useResponsive } from '../../hooks/useResponsive';
import CustomButton from '../common/CustomButton';

const ManagerCard = ({ manager, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();

  const deviceType = useResponsive();
  const isMobile = deviceType === 'mobile' || deviceType === 'tablet';

  const handleExpandClick = () => {
    setIsExpanded(!isExpanded);
  };

  const getBackgroundColor = (index) => {
    return index % 2 === 0 ? '#2c2c2c' : '#050505';
  };

  const handleEditClick = () => {
    navigate(`/manager/edit/${manager.id}`);
  };

  const handleDeleteClick = () => {
    onDelete(manager.id);
  };

  return (
    <Card
      sx={{
        minWidth: isMobile ? 300 : 350,
        margin: 2,
        borderRadius: '12px',
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        border: `1px solid ${theme.palette.text.secondary}`,
      }}
    >
      <Box
        onClick={handleExpandClick}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'start',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Typography
            variant="p"
            component="div"
            sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}
          >
            {manager.firstName} {manager.lastName}
          </Typography>
          <Typography variant="p" color={theme.palette.text.secondary} component="div">
            {manager.phone || 'Telefone não informado'}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            onClick={handleExpandClick}
            aria-expanded={isExpanded}
            aria-label="mostrar mais"
            sx={{
              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: theme.transitions.create('transform', {
                duration: theme.transitions.duration.shortest,
              }),
            }}
          >
            <ExpandMoreIcon />
          </IconButton>
        </Box>
      </Box>

      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <CardContent
            sx={{
              textAlign: 'center',
              pt: 2,
              pb: 0,
            }}
          >
            <Typography
              variant="subtitle3"
              fontWeight={600}
              sx={{
                mb: 1,
                color: theme.palette.text.secondary,
              }}
            >
              Categorias
            </Typography>
            <Divider sx={{ my: 1, borderColor: theme.palette.divider }} />
            {manager.categories.length > 0 ? (
              <List dense>
                {manager.categories.map((cat, index) => (
                  <ListItem
                    key={cat.category.id}
                    sx={{
                      width: '250px',
                      textAlign: 'center',
                      backgroundColor: getBackgroundColor(index),
                      borderRadius: '8px',
                      marginBottom: '8px',
                      color: theme.palette.text.primary,
                      m: 0.5,
                    }}
                  >
                    <ListItemText primary={cat.category.name || 'Categoria desconhecida'} />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Nenhuma categoria associada.
              </Typography>
            )}
          </CardContent>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, my: 2, width: '90%' }}>
            <CustomButton variant="contained" color="warning" onClick={handleEditClick}>
              Editar
            </CustomButton>
            <CustomButton variant="contained" color="error" onClick={handleDeleteClick}>
              Apagar
            </CustomButton>
          </Box>
        </Box>
      </Collapse>
    </Card>
  );
};

export default ManagerCard;

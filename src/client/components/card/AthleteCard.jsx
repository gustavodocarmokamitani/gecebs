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

const AthleteCard = ({ athlete, onEdit, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();

  const deviceType = useResponsive();
  const isMobile = deviceType === 'mobile' || deviceType === 'tablet'; // Função para alternar o estado de expansão

  const handleExpandClick = () => {
    setIsExpanded(!isExpanded);
  };

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

  const getBackgroundColor = (index) => {
    return index % 2 === 0 ? '#2c2c2c' : '#050505';
  };

  const handleEditClick = () => {
    // ⚠️ CORRIGIDO: Agora usa a prop 'onEdit' do componente pai
    if (onEdit) {
      onEdit();
    }
  };

  return (
    <Card
      sx={{
        minWidth: isMobile ? 270 : 350,
        maxWidth: isMobile ? 300 : 350,
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
          <Typography variant="p" component="div">
            {athlete.firstName} {athlete.lastName}
          </Typography>
          <Typography variant="p" color={theme.palette.text.secondary} component="div">
            {athlete.phone}
          </Typography>
          <Typography variant="p" color={theme.palette.text.secondary} component="div">
            {athlete.federationId}
          </Typography>
          <Typography
            variant="p"
            color={theme.palette.text.secondary}
            component="div"
            fontWeight={300}
          >
            {new Intl.DateTimeFormat('pt-BR').format(new Date(athlete.birthDate))}
          </Typography>
          <Typography
            variant="p"
            color={theme.palette.text.secondary}
            component="div"
            fontWeight={300}
          >
            Número do uniforme:
            <span style={{ color: theme.palette.secondary.main, fontWeight: '600' }}>
              {athlete.shirtNumber}
            </span>
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
            {athlete.categories && athlete.categories.length > 0 && (
              <List dense>
                {athlete.categories.map((category, index) => (
                  <ListItem
                    key={category.categoryId}
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
                    <ListItemText
                      primary={categoryLabels[category.categoryId] || 'Categoria desconhecida'}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, my: 2, width: '90%' }}>
            <CustomButton variant="contained" color="warning" onClick={handleEditClick}>
              Editar
            </CustomButton>
            <CustomButton variant="contained" color="error" onClick={onDelete}>
              Apagar
            </CustomButton>
          </Box>
        </Box>
      </Collapse>
    </Card>
  );
};

export default AthleteCard;

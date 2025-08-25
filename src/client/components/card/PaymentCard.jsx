// src/components/card/PaymentCard.jsx

import React, { useState, useEffect } from 'react'; // Importe o useEffect
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
  CircularProgress, // Importe o CircularProgress
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useResponsive } from '../../hooks/useResponsive';
import CustomButton from '../common/CustomButton';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye';
import PaymentService from '../../services/Payment'; // Importe o serviço de pagamento
import { toast } from 'react-toastify';

const PaymentCard = ({ payment }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [athletes, setAthletes] = useState([]); // Novo estado para atletas
  const [isLoading, setIsLoading] = useState(false); // Novo estado para carregamento
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
    navigate(`/payment/edit/${payment.id}`);
  };

  // Use useEffect para buscar os atletas quando o card for expandido
  useEffect(() => {
    if (isExpanded && payment?.id) {
      const fetchAthletes = async () => {
        setIsLoading(true);
        try {
          // Chama a nova rota da API
          const fetchedAthletes = await PaymentService.getAthletesWithPaymentStatus(payment.id);

          setAthletes(fetchedAthletes);
        } catch (error) {
          console.error('Erro ao buscar atletas do pagamento:', error);
          toast.error('Erro ao carregar a lista de atletas.');
          setAthletes([]);
        } finally {
          setIsLoading(false);
        }
      };
      fetchAthletes();
    }
  }, [isExpanded, payment?.id]);

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
          <Typography variant="p" component="div">
            {payment.name}
          </Typography>
          <Typography variant="p" color={theme.palette.text.secondary} component="div">
            Valor: R$ {payment.value.toFixed(2)}
          </Typography>
          <Typography variant="p" color={theme.palette.text.secondary} component="div">
            Vencimento: {new Intl.DateTimeFormat('pt-BR').format(new Date(payment.dueDate))}
          </Typography>
          <Typography variant="p" color={theme.palette.text.secondary} component="div">
            Chave Pix: {payment.pixKey}
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
              Itens do Pagamento
            </Typography>
            <Divider sx={{ my: 1, borderColor: theme.palette.divider }} />
            {payment.items.length > 0 && (
              <List dense>
                {payment.items.map((item, index) => (
                  <ListItem
                    key={item.id}
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
                    <ListItemText primary={item.name} secondary={`R$ ${item.value.toFixed(2)}`} />
                  </ListItem>
                ))}
              </List>
            )}

            <Typography
              variant="subtitle3"
              fontWeight={600}
              sx={{
                mt: 2,
                mb: 1,
                color: theme.palette.text.secondary,
              }}
            >
              Status de Pagamento
            </Typography>
            <Divider sx={{ my: 1, borderColor: theme.palette.divider }} />
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                <CircularProgress size={24} />
              </Box>
            ) : Array.isArray(athletes) && athletes.length > 0 ? (
              <List dense>
                {athletes.map((athlete, index) => (
                  <ListItem
                    key={athlete.userId}
                    sx={{
                      width: '250px',
                      textAlign: 'center',
                      backgroundColor: getBackgroundColor(index),
                      borderRadius: '8px',
                      marginBottom: '8px',
                      color: theme.palette.text.primary,
                      m: 0.5,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <ListItemText
                      primary={`${athlete.firstName} ${athlete.lastName}`}
                      secondary={athlete.status ? 'Pago' : 'Pendente'}
                    />
                    <Box
                      sx={{
                        color: athlete.status
                          ? theme.palette.success.main
                          : theme.palette.warning.main,
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {athlete.status ? <CheckCircleOutlineIcon /> : <PanoramaFishEyeIcon />}
                    </Box>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                Nenhum atleta nesta categoria.
              </Typography>
            )}
          </CardContent>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, my: 2, width: '90%' }}>
            <CustomButton variant="contained" color="warning" onClick={handleEditClick}>
              Editar
            </CustomButton>
            <CustomButton variant="contained" color="error">
              Apagar
            </CustomButton>
          </Box>
        </Box>
      </Collapse>
    </Card>
  );
};

export default PaymentCard;

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
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useResponsive } from '../../hooks/useResponsive';
import CustomButton from '../common/CustomButton';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye';

const PaymentCard = ({ payment }) => {
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
    navigate(`/payment/edit/${event.id}`);
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
              Pagamentos Confirmados
            </Typography>
            <Divider sx={{ my: 1, borderColor: theme.palette.divider }} />
            {payment.paidBy.length > 0 && (
              <List dense>
                {payment.paidBy.map((user, index) => (
                  <ListItem
                    key={user.userId}
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
                      primary={user.user.firstName + ' ' + user.user.lastName}
                      secondary={
                        user.paidAt
                          ? `Pago em: ${new Intl.DateTimeFormat('pt-BR').format(new Date(user.paidAt))}`
                          : 'Aguardando pagamento'
                      }
                    />
                    <Box
                      sx={{
                        color: user.paidAt
                          ? theme.palette.success.main
                          : theme.palette.warning.main,
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {user.paidAt ? <CheckCircleOutlineIcon /> : <PanoramaFishEyeIcon />}
                    </Box>
                  </ListItem>
                ))}
              </List>
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

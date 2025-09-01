import React from 'react';
import { Card, CardContent, Typography, Box, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CustomButton from '../common/CustomButton';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useResponsive } from '../../hooks/useResponsive';
import { useNavigate } from 'react-router-dom';
import DoneAllIcon from '@mui/icons-material/DoneAll';

const AthletePaymentCard = ({ payment, onConfirmPayment }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const deviceType = useResponsive();
  const isMobile = deviceType === 'mobile' || deviceType === 'tablet';

  const isPending = payment.paidAt === null;
  const isPaid = payment.paidAt !== null;

  const handleConfirmClick = () => {
    if (onConfirmPayment) {
      onConfirmPayment(payment.id);
    }
  };

  const formattedDate = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(payment.dueDate));

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
      <Box sx={{ p: 2 }}>
        <Typography variant="p" component="div" fontWeight="bold">
          {payment.name}
        </Typography>
        <Typography variant="p" color={theme.palette.text.secondary} component="div" sx={{ mt: 1 }}>
          Vencimento: {formattedDate}
        </Typography>
        <Typography variant="p" color={theme.palette.text.secondary} component="div">
          Valor: R$ {payment.value.toFixed(2)}
        </Typography>

        <Divider sx={{ my: 2, borderColor: theme.palette.divider }} />

        <CardContent sx={{ p: 0 }}>
          <Typography variant="subtitle2" fontWeight={600} color="text.secondary" component="div">
            Detalhes do Pagamento
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }} component="div">
            Chave PIX: {payment.pixKey || 'Não aplicável'}
          </Typography>

          {/* Exibe os itens se existirem */}
          {payment.items && payment.items.length > 0 && (
            <Typography variant="body2" color="text.secondary" component="div">
              Itens:
              {payment.items.map((item, index) => (
                <Typography key={index} variant="body2" color="text.secondary" component="div">
                  - {item.name}: R$ {item.value.toFixed(2)}
                </Typography>
              ))}
            </Typography>
          )}

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ display: 'flex', alignItems: 'center', mt: 1 }}
            component="div"
          >
            Pagamento: {isPaid ? 'Pago' : 'Pendente'}
            <Box component="span" sx={{ ml: 1 }}>
              {isPaid ? (
                <CheckCircleIcon color="success" sx={{ fontSize: 20 }} />
              ) : (
                <AccessTimeIcon color="warning" sx={{ fontSize: 20 }} />
              )}
            </Box>
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ display: 'flex', alignItems: 'center', mt: 1 }}
            component="div"
          >
            Status: {payment.isFinalized ? 'Finalizado' : 'Aberto'}
            <Box component="span" sx={{ ml: 1 }}>
              {payment.isFinalized ? (
                <DoneAllIcon fontSize="small" sx={{ color: theme.palette.success.main }} />
              ) : null}
            </Box>
          </Typography>
        </CardContent>
      </Box>

      {/* Ações para o atleta */}
      <Box sx={{ p: 2, pt: 0 }}>
        {isPending && onConfirmPayment && (
          <CustomButton
            variant="contained"
            color="secondary"
            onClick={handleConfirmClick}
            sx={{ width: '100%' }}
          >
            Realizar Pagamento
          </CustomButton>
        )}
      </Box>
    </Card>
  );
};

export default AthletePaymentCard;

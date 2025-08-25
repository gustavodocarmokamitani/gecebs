import React from 'react';
import { Card, CardContent, Typography, Box, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CustomButton from '../common/CustomButton';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useResponsive } from '../../hooks/useResponsive';

const AthletePaymentCard = ({ payment, onConfirmPayment }) => {
  const theme = useTheme();
  const deviceType = useResponsive();
  const isMobile = deviceType === 'mobile' || deviceType === 'tablet';

  const isPending = payment.status === 'pending';
  const isPaid = payment.status === 'paid';

  const handleConfirmClick = () => {
    if (onConfirmPayment) {
      onConfirmPayment(payment.id);
    }
  };

  const statusIcon = isPaid ? (
    <CheckCircleIcon color="success" sx={{ fontSize: 40 }} />
  ) : (
    <AccessTimeIcon color="warning" sx={{ fontSize: 40 }} />
  );

  return (
    <Card
      sx={{
        width: isMobile ? '100%' : '350px',
        margin: 'auto',
        borderRadius: '12px',
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        border: `1px solid ${theme.palette.text.secondary}`,
        my: 2,
      }}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h6" fontWeight="bold">
            {payment.name}
          </Typography>
          <Typography variant="body1" color={theme.palette.text.secondary}>
            Valor: R$ {payment.value.toFixed(2)}
          </Typography>
          <Typography variant="body2" color={theme.palette.text.secondary}>
            Vencimento: {new Intl.DateTimeFormat('pt-BR').format(new Date(payment.dueDate))}
          </Typography>
        </Box>
        {statusIcon}
      </Box>

      <Divider sx={{ my: 1, borderColor: theme.palette.divider }} />

      <CardContent sx={{ pt: 1, pb: 2 }}>
        <Typography variant="subtitle2" fontWeight={600} color="text.secondary">
          Detalhes do Pagamento
        </Typography>
        <Typography variant="body2" color="text.primary">
          Chave PIX: {payment.pixKey || 'Não aplicável'}
        </Typography>
      </CardContent>

      {isPending && (
        <Box sx={{ p: 2, pt: 0 }}>
          <CustomButton
            variant="contained"
            color="success"
            onClick={handleConfirmClick}
            sx={{ width: '100%' }}
          >
            Confirmar Pagamento
          </CustomButton>
        </Box>
      )}
    </Card>
  );
};

export default AthletePaymentCard;

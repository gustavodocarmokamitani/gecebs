import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Divider,
  CircularProgress,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { toast } from 'react-toastify';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CustomButton from '../components/common/CustomButton';
import PaymentService from '../services/Payment';

function PaymentSelectionPage() {
  const { paymentId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  const [payment, setPayment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [selectedItems, setSelectedItems] = useState({});
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [pixKeyCopied, setPixKeyCopied] = useState(false);

  useEffect(() => {
    const fetchPaymentDetails = async (id) => {
      try {
        const paymentData = await PaymentService.getPaymentDetails(id);

        setPayment(paymentData);
        if (paymentData && Array.isArray(paymentData.items)) {
          const initialSelectedItems = {};
          paymentData.items.forEach((item) => {
            initialSelectedItems[item.id] = item.quantityEnabled ? 1 : 0;
          });
          setSelectedItems(initialSelectedItems);
        } else {
          setSelectedItems({});
        }
      } catch (err) {
        console.error('Erro ao buscar detalhes do pagamento:', err);
        setError('Erro ao carregar os detalhes do pagamento. Tente novamente.');
        toast.error('Erro ao carregar o pagamento.');
      } finally {
        setIsLoading(false);
      }
    };

    if (paymentId) {
      fetchPaymentDetails(paymentId);
    }
  }, [paymentId]);

  const handleQuantityChange = (itemId, change) => {
    setSelectedItems((prevItems) => {
      const currentQuantity = prevItems[itemId] || 0;
      const newQuantity = currentQuantity + change;
      if (newQuantity >= 0) {
        return { ...prevItems, [itemId]: newQuantity };
      }
      return prevItems;
    });
  };

  const calculateTotal = () => {
    if (!payment) return 0;
    let total = 0;
    payment.items?.forEach((item) => {
      const quantity = item.quantityEnabled ? selectedItems[item.id] || 0 : 1;
      total += quantity * item.value;
    });
    return total;
  };

  const handleOpenConfirmDialog = () => {
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };

  const handleCopyPixKey = async () => {
    try {
      if (payment?.pixKey) {
        await navigator.clipboard.writeText(payment.pixKey);
        toast.success('Chave PIX copiada!');
        setPixKeyCopied(true);
      } else {
        toast.warn('Chave PIX não disponível.');
      }
    } catch (err) {
      console.error('Erro ao copiar a chave PIX:', err);
      toast.error('Erro ao copiar. Tente novamente.');
    }
  };

  const handleConfirmPayment = async () => {
    setIsProcessing(true);
    handleCloseConfirmDialog();
    try {
      await PaymentService.processPaymentWithItems(paymentId, selectedItems);
      toast.success('Pagamento processado com sucesso!');
      navigate('/athlete-dashboard');
    } catch (error) {
      toast.error('Erro ao processar o pagamento. Tente novamente.');
      console.error('Erro ao processar o pagamento:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !payment) {
    return (
      <Typography color="error" align="center">
        {error || 'Pagamento não encontrado.'}
      </Typography>
    );
  }

  return (
    <Box>
      <Typography variant="h6" color="text.primary" gutterBottom>
        {payment.name}
      </Typography>
      <Divider sx={{ my: 2, borderColor: theme.palette.divider }} />

      {payment.items.length > 0 ? (
        <Box>
          <Typography variant="h6" gutterBottom color="textSecondary" sx={{ my: 4 }}>
            Selecione a quantidade de itens:
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {payment.items.map((item) => (
              <Paper
                key={item.id}
                sx={{
                  p: 2,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box>
                  <Typography variant="body1" fontWeight="bold">
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    R$ {item.value.toFixed(2).replace('.', ',')}
                  </Typography>
                </Box>
                {item.quantityEnabled ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton
                      onClick={() => handleQuantityChange(item.id, -1)}
                      disabled={selectedItems[item.id] <= 0}
                    >
                      <RemoveCircleOutlineIcon color="primary" />
                    </IconButton>
                    <Typography variant="h6">{selectedItems[item.id] || 0}</Typography>
                    <IconButton onClick={() => handleQuantityChange(item.id, 1)}>
                      <AddCircleOutlineIcon color="primary" />
                    </IconButton>
                  </Box>
                ) : (
                  <Box>
                    <Typography variant="h6" fontWeight="bold" color="primary.main">
                      R$ {item.value.toFixed(2).replace('.', ',')}
                    </Typography>
                  </Box>
                )}
              </Paper>
            ))}
          </Box>
        </Box>
      ) : (
        <Typography color="text.secondary" align="center">
          Nenhum item para seleção encontrado.
        </Typography>
      )}

      <Divider sx={{ my: 2, borderColor: theme.palette.divider }} />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" fontWeight="bold" color="text.secondary">
            Total:
          </Typography>
          <Typography variant="h5" fontWeight="bold" color="primary.main">
            R$ {calculateTotal().toFixed(2).replace('.', ',')}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column' }}>
        <CustomButton
          variant="contained"
          color="primary"
          onClick={handleOpenConfirmDialog}
          disabled={calculateTotal() <= 0 || isProcessing || !pixKeyCopied}
          sx={{ width: '100%' }}
        >
          {isProcessing ? <CircularProgress size={24} color="inherit" /> : 'Confirmar Pagamento'}
        </CustomButton>
        <CustomButton
          variant="contained"
          color="secondary"
          startIcon={<ContentCopyIcon />}
          onClick={handleCopyPixKey}
          disabled={!payment?.pixKey}
          sx={{ mt: 5 }}
        >
          Copiar Chave PIX
        </CustomButton>
      </Box>

      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogTitle id="confirm-dialog-title">Confirmação de Pagamento</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-dialog-description">
            Após a confirmação, o pagamento será marcado como processado e enviado para o gerente de
            equipe para aprovação.
            <br />
            <br />
            Esta ação não pode ser desfeita. Tem certeza que deseja continuar?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <CustomButton onClick={handleCloseConfirmDialog} variant="contained">
            Cancelar
          </CustomButton>
          <CustomButton
            onClick={handleConfirmPayment}
            variant="contained"
            color="primary"
            autoFocus
          >
            Confirmar
          </CustomButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default PaymentSelectionPage;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Divider,
  Box,
  CircularProgress,
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
import { useResponsive } from '../hooks/useResponsive';
import { useTheme } from '@mui/material/styles';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import PaymentService from '../services/Payment';
import PaymentCard from '../components/card/PaymentCard';
import CustomButton from '../components/common/CustomButton';
import CustomInput from '../components/common/CustomInput';

function Payment() {
  const theme = useTheme();
  const deviceType = useResponsive();
  const isMobile = deviceType === 'mobile' || deviceType === 'tablet';
  const navigate = useNavigate();

  const [payments, setPayments] = useState([]);
  const [groupedPayments, setGroupedPayments] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [paymentIdToDelete, setPaymentIdToDelete] = useState(null);

  const [openFinalizeDialog, setOpenFinalizeDialog] = useState(false);
  const [paymentIdToFinalize, setPaymentIdToFinalize] = useState(null);

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const groupPaymentsByCategory = (paymentsToGroup) => {
    const groups = {};
    paymentsToGroup.forEach((payment) => {
      const categoryId = payment.category?.id || 'no-category';
      if (!groups[categoryId]) {
        groups[categoryId] = {
          name: payment.category?.name || 'Sem Categoria',
          payments: [],
        };
      }
      groups[categoryId].payments.push(payment);
    });
    return groups;
  };

  const fetchPayments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedPayments = await PaymentService.listAllTeamPayments();
      setPayments(fetchedPayments);
    } catch (err) {
      console.error('Erro ao buscar pagamentos:', err);
      setError('Erro ao carregar os pagamentos. Tente novamente mais tarde.');
      toast.error('Erro ao carregar os pagamentos.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  useEffect(() => {
    const normalizedSearchTerm = searchTerm.trim();

    const isDayMonthYear = /^\d{2}\/\d{2}\/\d{4}$/.test(normalizedSearchTerm);
    const isMonthYear = /^\d{2}\/\d{4}$/.test(normalizedSearchTerm);
    const isYear = /^\d{4}$/.test(normalizedSearchTerm);

    const filteredPayments = payments.filter((payment) => {
      const matchesNameOrPixKey =
        payment.name.toLowerCase().includes(normalizedSearchTerm.toLowerCase()) ||
        (payment.pixKey &&
          payment.pixKey.toLowerCase().includes(normalizedSearchTerm.toLowerCase()));

      const paymentDate = new Date(payment.dueDate);
      const paymentDay = String(paymentDate.getDate()).padStart(2, '0');
      const paymentMonth = String(paymentDate.getMonth() + 1).padStart(2, '0');
      const paymentYear = paymentDate.getFullYear();

      const matchesDate =
        (isDayMonthYear &&
          `${paymentDay}/${paymentMonth}/${paymentYear}` === normalizedSearchTerm) ||
        (isMonthYear && `${paymentMonth}/${paymentYear}` === normalizedSearchTerm) ||
        (isYear && paymentYear === Number(normalizedSearchTerm));

      return matchesNameOrPixKey || matchesDate;
    });

    setGroupedPayments(groupPaymentsByCategory(filteredPayments));
  }, [payments, searchTerm]);

  const handleAddPaymentClick = () => {
    navigate('/payment/new');
  };

  const handleEditPayment = (id) => {
    navigate(`/payment/edit/${id}`);
  };

  const handleOpenDeleteDialog = (id) => {
    setPaymentIdToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setPaymentIdToDelete(null);
  };

  const handleConfirmDelete = async () => {
    handleCloseDeleteDialog();
    if (paymentIdToDelete) {
      try {
        await PaymentService.delete(paymentIdToDelete);
        toast.success('Pagamento excluído com sucesso!');
        fetchPayments();
      } catch (err) {
        console.error('Erro ao excluir pagamento:', err);
        const errorMessage = err.response?.data?.message || 'Erro ao excluir o pagamento.';
        toast.error(errorMessage);
      }
    }
  };

  const handleFinalizePayment = async (id) => {
    setPaymentIdToFinalize(id);
    setOpenFinalizeDialog(true);
  };

  const handleCloseFinalizeDialog = () => {
    setOpenFinalizeDialog(false);
    setPaymentIdToFinalize(null);
  };

  const handleConfirmFinalize = async () => {
    handleCloseFinalizeDialog();
    if (paymentIdToFinalize) {
      try {
        await PaymentService.finalizePayment(paymentIdToFinalize);
        toast.success('Pagamento finalizado com sucesso!');
        fetchPayments();
      } catch (err) {
        console.error('Erro ao finalizar pagamento:', err);
        const errorMessage = err.response?.data?.message || 'Erro ao finalizar o pagamento.';
        toast.error(errorMessage);
      }
    }
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
          Gestão de Despesas
          <span>
            <ChevronRightIcon sx={{ mt: 1.5 }} />
          </span>
          <Box component="span" color="primary.main" sx={{ fontWeight: 100 }}>
            Visão Geral
          </Box>
        </Typography>
        <CustomButton
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddPaymentClick}
          sx={{ mr: isMobile ? 0 : 5 }}
        >
          Adicionar Pagamento
        </CustomButton>
      </Box>
      <Divider sx={{ my: 2, borderColor: theme.palette.divider }} />
      <Box sx={{ mt: 2, mb: 4, mr: isMobile ? 0 : 5 }}>
        <CustomInput
          label="Buscar Pagamento"
          placeholder="Digite o nome do pagamento ou chave PIX"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>

      <Typography sx={{ my: 3 }} variant="h6" color="textSecondary">
        Pagamentos
      </Typography>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" align="center">
          {error}
        </Typography>
      ) : Object.keys(groupedPayments).length === 0 ? (
        <Typography color="text.secondary" align="center">
          Nenhum pagamento encontrado.
        </Typography>
      ) : (
        Object.keys(groupedPayments).map((categoryId, index) => {
          const group = groupedPayments[categoryId];
          if (group.payments.length === 0) return null;

          return (
            <Accordion
              key={categoryId}
              expanded={expanded === categoryId}
              onChange={handleAccordionChange(categoryId)}
              sx={{
                mb: 2,
                '&::before': { display: 'none' },
                ...(index === 0 && {
                  borderTopLeftRadius: theme.shape.borderRadius,
                  borderTopRightRadius: theme.shape.borderRadius,
                }),
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel-${categoryId}-content`}
                id={`panel-${categoryId}-header`}
                sx={{ borderBottom: 'none' }}
              >
                <Typography variant="h6" color="textPrimary">
                  {group.name}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box
                  sx={{
                    display: 'flex',
                    overflowX: 'auto',
                    gap: 2,
                    pb: 2,
                    '&::-webkit-scrollbar': { height: 8, width: 8 },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: theme.palette.primary.main,
                      borderRadius: 4,
                    },
                    alignItems: 'flex-start',
                  }}
                >
                  {group.payments.map((payment) => (
                    <PaymentCard
                      key={payment.id}
                      payment={payment}
                      onEdit={() => handleEditPayment(payment.id)}
                      onDelete={() => handleOpenDeleteDialog(payment.id)}
                      onFinalize={() => handleFinalizePayment(payment.id)} // 👈 AQUI!
                    />
                  ))}
                </Box>
              </AccordionDetails>
            </Accordion>
          );
        })
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
            Ao excluir esta despesa, o registro será removido permanentemente.
            <br />
            <br />
            Esta ação é irreversível. Tem certeza que deseja continuar?
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

      <Dialog
        open={openFinalizeDialog}
        onClose={handleCloseFinalizeDialog}
        aria-labelledby="finalize-dialog-title"
        aria-describedby="finalize-dialog-description"
      >
        <DialogTitle id="finalize-dialog-title">{'Confirmar Finalização'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="finalize-dialog-description">
            Ao finalizar este pagamento, ele não poderá mais ser editado ou excluído.
            <br />
            <br />
            Tem certeza que deseja continuar?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <CustomButton onClick={handleCloseFinalizeDialog} variant="contained">
            Cancelar
          </CustomButton>
          <CustomButton
            onClick={handleConfirmFinalize}
            variant="contained"
            color="success"
            autoFocus
          >
            Confirmar Finalização
          </CustomButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Payment;

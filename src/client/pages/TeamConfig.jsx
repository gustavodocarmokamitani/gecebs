import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Divider,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTheme } from '@mui/material/styles';
import CustomInput from '../components/common/CustomInput';
import CustomButton from '../components/common/CustomButton';
import TeamService from '../services/Team';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useResponsive } from '../hooks/useResponsive';
import usePhoneInput from '../hooks/usePhoneInput';
import Auth from '../services/Auth';

// Importações para a nova funcionalidade de relatório
import AnalyticsService from '../services/Analytics';
import * as XLSX from 'xlsx';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

const TeamConfig = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const deviceType = useResponsive();
  const isMobile = deviceType === 'mobile' || deviceType === 'tablet';

  const [teamData, setTeamData] = useState({
    name: '',
    email: '',
    image: '',
  });

  const { phoneNumber, phoneError, handlePhoneChange } = usePhoneInput();
  const [phoneServerError, setPhoneServerError] = useState('');

  const [passwordData, setPasswordData] = useState({
    managerPassword: '',
    athletePassword: '',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingTeamData, setIsSubmittingTeamData] = useState(false);
  const [isSubmittingPasswords, setIsSubmittingPasswords] = useState(false);

  // Estados para a funcionalidade de exportação
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState(null);

  const [expanded, setExpanded] = useState('dados-do-time');

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const data = await TeamService.getTeamDetails();
        setTeamData(data);
        if (data.phone) {
          handlePhoneChange({ target: { value: data.phone } });
        }
      } catch (err) {
        console.error('Erro ao buscar dados do time:', err);
        toast.error('Erro ao carregar configurações do time.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTeamData();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      const phoneToVerify = phoneNumber.replace(/\D/g, '');
      if (phoneToVerify.length >= 10 && phoneToVerify !== teamData.phone) {
        try {
          const result = await Auth.checkPhoneExists(phoneToVerify);
          if (result.exists) {
            setPhoneServerError('Este telefone já está em uso.');
          } else {
            setPhoneServerError('');
          }
        } catch (err) {
          setPhoneServerError('Não foi possível verificar o telefone.');
        }
      } else {
        setPhoneServerError('');
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [phoneNumber, teamData.phone]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTeamData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageChange = (e) => {
    const { name, value } = e.target;
    setTeamData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmitTeamData = async (e) => {
    e.preventDefault();

    setIsSubmittingTeamData(true);
    try {
      await TeamService.updateTeam({ ...teamData, phone: phoneNumber.replace(/\D/g, '') });
      toast.success('Configurações salvas com sucesso!');
      navigate('/settings');
      setExpanded('');
    } catch (err) {
      console.error('Erro ao salvar dados do time:', err);
      const errorMessage = err.response?.data?.message || 'Erro ao salvar dados do time.';
      toast.error(errorMessage);
    } finally {
      setIsSubmittingTeamData(false);
    }
  };

  const handleSubmitPasswords = async (e) => {
    e.preventDefault();

    setIsSubmittingPasswords(true);
    let success = false;
    let successCount = 0;

    try {
      const { managerPassword, athletePassword } = passwordData;

      if (managerPassword) {
        await TeamService.updateManagerPasswords(managerPassword);
        success = true;
        successCount++;
      }
      if (athletePassword) {
        await TeamService.updateAthletePasswords(athletePassword);
        success = true;
        successCount++;
      }

      if (success) {
        toast.success(
          successCount === 2
            ? 'Senhas de managers e atletas atualizadas com sucesso!'
            : `Senha de ${managerPassword ? 'managers' : 'atletas'} atualizada com sucesso!`
        );
        setPasswordData({ managerPassword: '', athletePassword: '' });
      } else {
        toast.info('Nenhuma senha foi fornecida para atualização.');
      }
      setExpanded('');
    } catch (err) {
      console.error('Erro ao atualizar senhas:', err);
      const errorMessage = err.response?.data?.message || 'Erro ao atualizar as senhas.';
      toast.error(errorMessage);
    } finally {
      setIsSubmittingPasswords(false);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    setExportError(null);

    try {
      const categoriesData = await AnalyticsService.exportAnalytics();

      if (!Array.isArray(categoriesData) || categoriesData.length === 0) {
        toast.info('Nenhum dado válido encontrado para gerar o relatório.');
        setIsExporting(false);
        return;
      }

      const workbook = XLSX.utils.book_new();

      // 1. Planilha de Atletas
      const allAthletes = [];
      categoriesData.forEach((category) => {
        if (category.athletes && category.athletes.length > 0) {
          const formattedAthletes = category.athletes.map((link) => ({
            'Nome Completo': `${link.athlete.firstName} ${link.athlete.lastName}`,
            Usuário: link.athlete.user.username,
            Telefone: link.athlete.phone,
            'Data de Nascimento': link.athlete.birthDate
              ? new Date(link.athlete.birthDate).toLocaleDateString('pt-BR')
              : 'N/A',
            'ID Federação': link.athlete.federationId || 'N/A',
            'ID Confederação': link.athlete.confederationId || 'N/A',
            Categoria: category.name,
          }));
          allAthletes.push(...formattedAthletes);
        }
      });

      if (allAthletes.length > 0) {
        const athletesSheet = XLSX.utils.json_to_sheet(allAthletes);
        XLSX.utils.book_append_sheet(workbook, athletesSheet, 'Atletas');
      }

      // 2. Planilha de Eventos
      const allEvents = [];
      categoriesData.forEach((category) => {
        if (category.events && category.events.length > 0) {
          const formattedEvents = category.events.map((event) => ({
            Evento: event.name,
            Data: event.date ? new Date(event.date).toLocaleDateString('pt-BR') : 'N/A',
            Local: event.location || 'N/A',
            Tipo: event.type,
            Categoria: category.name,
          }));
          allEvents.push(...formattedEvents);
        }
      });

      if (allEvents.length > 0) {
        const eventsSheet = XLSX.utils.json_to_sheet(allEvents);
        XLSX.utils.book_append_sheet(workbook, eventsSheet, 'Eventos');
      }

      // 3. Planilha de Pagamentos
      const allPayments = [];
      categoriesData.forEach((category) => {
        if (category.payments && category.payments.length > 0) {
          const formattedPayments = category.payments.map((payment) => ({
            Pagamento: payment.name,
            'Valor (R$)': payment.value,
            Vencimento: payment.dueDate
              ? new Date(payment.dueDate).toLocaleDateString('pt-BR')
              : 'N/A',
            Categoria: category.name,
          }));
          allPayments.push(...formattedPayments);
        }
      });

      if (allPayments.length > 0) {
        const paymentsSheet = XLSX.utils.json_to_sheet(allPayments);
        XLSX.utils.book_append_sheet(workbook, paymentsSheet, 'Pagamentos');
      }

      // 4. Planilha de Resumo Financeiro
      const financialSummaryData = [];
      let totalValue = 0;
      categoriesData.forEach((category) => {
        let categoryTotalValue = 0;
        category.payments.forEach((payment) => {
          categoryTotalValue += payment.value;
        });
        if (categoryTotalValue > 0) {
          financialSummaryData.push({
            Categoria: category.name,
            'Valor Recebido (R$)': categoryTotalValue.toFixed(2),
          });
          totalValue += categoryTotalValue;
        }
      });
      if (financialSummaryData.length > 0) {
        financialSummaryData.push({
          Categoria: 'TOTAL GERAL',
          'Valor Recebido (R$)': totalValue.toFixed(2),
        });
        const financialSummarySheet = XLSX.utils.json_to_sheet(financialSummaryData);
        XLSX.utils.book_append_sheet(workbook, financialSummarySheet, 'Resumo Financeiro');
      }

      // Gerar o arquivo Excel final
      if (workbook.SheetNames.length > 0) {
        XLSX.writeFile(workbook, 'Relatorio_Gerencial.xlsx');
        toast.success('Relatório gerencial gerado com sucesso!');
      } else {
        toast.info('Nenhum dado para gerar o relatório.');
      }
    } catch (err) {
      console.error('Erro ao gerar o relatório:', err);
      const errorMessage = err.response?.data?.error || 'Erro ao gerar o relatório.';
      setExportError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography component="h6" variant="h6" gutterBottom color={theme.palette.text.secondary}>
        Configurações do Time
      </Typography>
      <Divider sx={{ my: 2, borderColor: theme.palette.divider }} />

      {/* Accordion: Dados do Time */}
      <Accordion
        expanded={expanded === 'dados-do-time'}
        onChange={handleAccordionChange('dados-do-time')}
        sx={{
          mb: 2,
          borderRadius: '20px',
          '&::before': { display: 'none' },
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: 'white',
            borderBottom: 'none',
            borderRadius: `20px 20px ${expanded === 'dados-do-time' ? '0 0' : '20px 20px'}`,
            '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
              transform: 'rotate(180deg)',
            },
          }}
        >
          <Typography variant="subtitle1">Dados do Time</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ px: isMobile ? 1 : 4, pt: 3, pb: 4 }}>
          <form onSubmit={handleSubmitTeamData}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                flexWrap: 'wrap',
                gap: 2,
              }}
            >
              <Box sx={{ width: isMobile ? '100%' : 'calc(50% - 8px)' }}>
                <CustomInput
                  label="Nome do Time"
                  name="name"
                  value={teamData.name || ''}
                  onChange={handleChange}
                  placeholder="Nome do seu time"
                  required
                />
              </Box>
              <Box sx={{ width: isMobile ? '100%' : 'calc(50% - 8px)' }}>
                <CustomInput
                  label="E-mail de Contato"
                  name="email"
                  value={teamData.email || ''}
                  onChange={handleChange}
                  placeholder="email@time.com"
                  type="email"
                  required
                />
              </Box>
              <Box sx={{ width: isMobile ? '100%' : 'calc(50% - 8px)' }}>
                <CustomInput
                  label="Telefone"
                  name="phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  placeholder="(xx) xxxxx-xxxx"
                  error={!!phoneError || !!phoneServerError}
                  helperText={phoneError || phoneServerError}
                />
              </Box>
              <Box sx={{ width: isMobile ? '100%' : 'calc(50% - 8px)' }}>
                <CustomInput
                  label="URL da Logo"
                  name="image"
                  value={teamData.image || ''}
                  onChange={handleImageChange}
                  placeholder="https://..."
                />
              </Box>
            </Box>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <CustomButton
                type="submit"
                variant="contained"
                disabled={isSubmittingTeamData || !!phoneError || !!phoneServerError}
              >
                {isSubmittingTeamData ? <CircularProgress size={24} /> : 'Salvar Alterações'}
              </CustomButton>
            </Box>
          </form>
        </AccordionDetails>
      </Accordion>

      {/* Accordion: Configuração de Senhas */}
      <Accordion
        expanded={expanded === 'configuracao-de-senhas'}
        onChange={handleAccordionChange('configuracao-de-senhas')}
        sx={{
          mt: 3,
          mb: 2,
          borderRadius: '20px',
          '&::before': { display: 'none' },
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: 'white',
            borderBottom: 'none',
            borderRadius: `20px 20px ${expanded === 'configuracao-de-senhas' ? '0 0' : '20px 20px'}`,
            '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
              transform: 'rotate(180deg)',
            },
          }}
        >
          <Typography variant="subtitle1">Configuração de Senhas</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ px: isMobile ? 1 : 4, pt: 3, pb: 4 }}>
          <form onSubmit={handleSubmitPasswords}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Redefina uma senha padrão para todos os managers ou atletas.
              </Typography>
              <CustomInput
                label="Nova Senha para Managers"
                name="managerPassword"
                type="password"
                value={passwordData.managerPassword}
                onChange={handlePasswordChange}
              />
              <CustomInput
                label="Nova Senha para Atletas"
                name="athletePassword"
                type="password"
                value={passwordData.athletePassword}
                onChange={handlePasswordChange}
              />
            </Box>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <CustomButton type="submit" variant="contained" disabled={isSubmittingPasswords}>
                {isSubmittingPasswords ? <CircularProgress size={24} /> : 'Atualizar Senha'}
              </CustomButton>
            </Box>
          </form>
        </AccordionDetails>
      </Accordion>

      {/* Accordion: Relatórios de Análise */}
      <Accordion
        expanded={expanded === 'relatorios'}
        onChange={handleAccordionChange('relatorios')}
        sx={{
          mt: 3,
          mb: 2,
          borderRadius: '20px',
          '&::before': { display: 'none' },
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: 'white',
            borderBottom: 'none',
            borderRadius: `20px 20px ${expanded === 'relatorios' ? '0 0' : '20px 20px'}`,
            '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
              transform: 'rotate(180deg)',
            },
          }}
        >
          <Typography variant="subtitle1">Relatórios de Análise</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ px: isMobile ? 1 : 4, pt: 3, pb: 4 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Clique no botão abaixo para gerar e baixar um relatório completo com dados de atletas,
              pagamentos e eventos em formato Excel.
            </Typography>
            <CustomButton
              onClick={handleExport}
              variant="contained"
              disabled={isExporting}
              startIcon={
                isExporting ? <CircularProgress size={20} color="inherit" /> : <FileDownloadIcon />
              }
            >
              {isExporting ? 'Gerando...' : 'Baixar Relatório'}
            </CustomButton>
            {exportError && (
              <Typography color="error" variant="body2">
                {exportError}
              </Typography>
            )}
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default TeamConfig;

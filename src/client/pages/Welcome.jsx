import React, { useState } from 'react';
import { Box, Typography, CircularProgress, Paper, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '../hooks/AuthContext';
import { useNavigate } from 'react-router-dom';
import CustomButton from '../components/common/CustomButton';
import SettingsIcon from '@mui/icons-material/Settings';

// Componente para o tutorial de Atleta
const AthleteTutorial = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [step, setStep] = useState(0);

  const handleNextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handleSkipTutorial = () => {
    navigate('/athlete-dashboard');
  };

  const steps = [
    // Passo 0: Introdução
    <Box key={0}>
      <Typography variant="h5" color="text.primary" gutterBottom sx={{ letterSpacing: '0.5px' }}>
        E aí, Craque! 🏆
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph sx={{ letterSpacing: '0.5px' }}>
        Bem-vindo ao seu QG de atleta! Aqui, a gente te deixa no controle de tudo para você focar no
        que realmente importa: a próxima jogada! ⚽️
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
        {' '}
        <Button onClick={handleSkipTutorial} sx={{ mr: 2, letterSpacing: '0.5px' }}>
          Pular Tutorial{' '}
        </Button>{' '}
        <CustomButton variant="contained" onClick={handleNextStep}>
          Começar{' '}
        </CustomButton>
      </Box>{' '}
    </Box>, // Passo 1: Dashboard

    <Box key={1}>
      <Typography variant="h5" color="text.primary" gutterBottom sx={{ letterSpacing: '0.5px' }}>
        Dashboard: <br /> Visão do Jogo!
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ letterSpacing: '0.5px', mt: 5 }}>
        Aqui você vê os{' '}
        <span style={{ fontWeight: 600, color: theme.palette.primary.main }}>próximos eventos</span>{' '}
        e os{' '}
        <span style={{ fontWeight: 600, color: theme.palette.primary.main }}>
          pagamentos pendentes{' '}
        </span>{' '}
        num piscar de olhos. Basta um clique para{' '}
        <span style={{ fontWeight: 600, color: theme.palette.primary.main }}>
          confirmar sua presença{' '}
        </span>{' '}
        e mostrar que você está pronto pra ação!
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
        {' '}
        <CustomButton variant="contained" onClick={handleNextStep}>
          Próximo{' '}
        </CustomButton>
      </Box>{' '}
    </Box>, // Passo 2: Pagamentos

    <Box key={2}>
      <Typography variant="h5" color="text.primary" gutterBottom sx={{ letterSpacing: '0.5px' }}>
        Pagamentos: <br /> Missão PIX!
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ letterSpacing: '0.5px' }}>
        Tem um pagamento pendente? <br /> Sem problemas! É só clicar, selecionar a quantidade de
        itens que precisa pagar e{' '}
        <span style={{ fontWeight: 600, color: theme.palette.primary.main }}>
          copiar a chave PIX{' '}
        </span>{' '}
        com um botão super prático.
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
        {' '}
        <CustomButton onClick={handleNextStep} variant="contained">
          Próximo{' '}
        </CustomButton>
      </Box>{' '}
    </Box>, // Passo 3: Histórico

    <Box key={3}>
      <Typography variant="h5" color="text.primary" gutterBottom sx={{ letterSpacing: '0.5px' }}>
        Históricos: <br /> Tudo na sua memória!
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph sx={{ letterSpacing: '0.5px' }}>
        Quer saber onde você esteve ou quais foram os seus gastos? <br /> Na seção de{' '}
        <span style={{ fontWeight: 600, color: theme.palette.primary.main }}>
          Histórico de Eventos{' '}
        </span>
        , você revisa todos os eventos passados e futuros. <br /> Em{' '}
        <span style={{ fontWeight: 600, color: theme.palette.primary.main }}>
          Histórico de Pagamentos{' '}
        </span>
        , todas as suas transações estão organizadas, para você nunca perder a conta. 📊
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
        {' '}
        <CustomButton onClick={handleSkipTutorial} variant="contained">
          Finalizar{' '}
        </CustomButton>
      </Box>{' '}
    </Box>,
  ];

  return steps[step];
};

// Componente para o tutorial de Proprietário da Equipe e Gerentes
const AdminTutorial = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const [step, setStep] = useState(0);

  const isOwner = user?.role === undefined;

  const handleNextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handleSkipTutorial = () => {
    navigate('/analytics');
  };

  const ownerSteps = [
    // Passo 0 (Owner): Boas-vindas
    <Box key={0}>
      <Typography variant="h5" color="text.primary" gutterBottom sx={{ letterSpacing: '0.5px' }}>
        Bem-vindo, Proprietário!
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph sx={{ letterSpacing: '0.5px' }}>
        Este é o seu painel de controle para gerenciar a equipe e os eventos. Vamos começar!
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
        {' '}
        <Button onClick={handleSkipTutorial} sx={{ mr: 2, letterSpacing: '0.5px' }}>
          Pular Tutorial{' '}
        </Button>{' '}
        <CustomButton variant="contained" onClick={handleNextStep}>
          Próximo{' '}
        </CustomButton>
      </Box>{' '}
    </Box>, // Passo 1 (Owner): Gerenciar Categorias

    <Box key={1}>
      <Typography variant="h5" color="text.primary" gutterBottom sx={{ letterSpacing: '0.5px' }}>
        Primeiro: Gerenciar Categorias
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph sx={{ letterSpacing: '0.5px' }}>
        Como{' '}
        <span style={{ fontWeight: 600, color: theme.palette.primary.main }}>
          Proprietário da Equipe
        </span>
        , você é o único que pode{' '}
        <span style={{ fontWeight: 600, color: theme.palette.primary.main }}>
          criar e apagar as categorias{' '}
        </span>
        . Este é o primeiro passo essencial para organizar o time.
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
        {' '}
        <CustomButton variant="contained" onClick={handleNextStep}>
          Próximo{' '}
        </CustomButton>
      </Box>{' '}
    </Box>, // Passo 2 (Owner): Gerenciar Managers

    <Box key={2}>
      <Typography variant="h5" color="text.primary" gutterBottom sx={{ letterSpacing: '0.5px' }}>
        Em seguida: Adicionar Gerentes
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph sx={{ letterSpacing: '0.5px' }}>
        Com as categorias criadas, você pode adicionar e gerenciar os{' '}
        <span style={{ fontWeight: 600, color: theme.palette.primary.main }}>
          Gerentes das Categorias.{' '}
        </span>
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
        {' '}
        <CustomButton variant="contained" onClick={handleNextStep}>
          Próximo{' '}
        </CustomButton>
      </Box>{' '}
    </Box>, // Passo 3 (Owner): Criar Atletas

    <Box key={3}>
      <Typography variant="h5" color="text.primary" gutterBottom sx={{ letterSpacing: '0.5px' }}>
        Depois: Cadastre os Atletas
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph sx={{ letterSpacing: '0.5px' }}>
        Com os gerentes no lugar, é hora de cadastrar os{' '}
        <span style={{ fontWeight: 600, color: theme.palette.primary.main }}>Atletas</span> em suas
        respectivas categorias.
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
        {' '}
        <CustomButton variant="contained" onClick={handleNextStep}>
          Próximo{' '}
        </CustomButton>
      </Box>{' '}
    </Box>, // Passo 4 (Owner): Eventos e Despesas

    <Box key={4}>
      <Typography variant="h5" color="text.primary" gutterBottom sx={{ letterSpacing: '0.5px' }}>
        Por fim: Eventos e Despesas
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph sx={{ letterSpacing: '0.5px' }}>
        Agora que a equipe está pronta, você pode{' '}
        <span style={{ fontWeight: 600, color: theme.palette.primary.main }}>
          criar eventos e despesas{' '}
        </span>
        , que podem ser para eventos específicos ou despesas gerais.
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
        {' '}
        <CustomButton variant="contained" onClick={handleNextStep}>
          Próximo{' '}
        </CustomButton>
      </Box>{' '}
    </Box>, // Passo 5 (Owner): Configurações e Senhas

    <Box key={5}>
      <Typography variant="h5" color="text.primary" gutterBottom sx={{ letterSpacing: '0.5px' }}>
        Configurações e Senhas
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph sx={{ letterSpacing: '0.5px' }}>
        Lembre-se que, na seção de <SettingsIcon sx={{ fontSize: 20 }} />,{' '}
        <span style={{ fontWeight: 600, color: theme.palette.primary.main }}>
          você pode redefinir a senha{' '}
        </span>{' '}
        dos Gerentes e dos Atletas a qualquer momento.
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mt: 2, fontStyle: 'italic', letterSpacing: '0.5px' }}
      >
        <span style={{ fontWeight: 600 }}>Atenção:</span> Por padrão, o usuário e a senha são
        definidos assim:
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1, letterSpacing: '0.5px' }}>
        - <span style={{ fontWeight: 600 }}>Usuário:</span> Número de telefone (ex: 11912345678, sem
        caracteres especiais).
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ letterSpacing: '0.5px' }}>
        - <span style={{ fontWeight: 600 }}>Senha:</span> O primeiro nome do usuário seguido por
        `123`.
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
        {' '}
        <CustomButton onClick={handleSkipTutorial} variant="contained">
          Finalizar{' '}
        </CustomButton>
      </Box>{' '}
    </Box>,
  ];

  const managerSteps = [
    // Passo 0 (Manager): Boas-vindas
    <Box key={0}>
      <Typography variant="h5" color="text.primary" gutterBottom sx={{ letterSpacing: '0.5px' }}>
        Bem-vindo, Gerente!
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph sx={{ letterSpacing: '0.5px' }}>
        Este é o seu painel de controle para gerenciar a equipe e os eventos. Vamos começar!
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
        {' '}
        <Button onClick={handleSkipTutorial} sx={{ mr: 2, letterSpacing: '0.5px' }}>
          Pular Tutorial{' '}
        </Button>{' '}
        <CustomButton variant="contained" onClick={handleNextStep}>
          Próximo{' '}
        </CustomButton>
      </Box>{' '}
    </Box>, // Passo 1 (Manager): Criar Atletas

    <Box key={1}>
      <Typography variant="h5" color="text.primary" gutterBottom sx={{ letterSpacing: '0.5px' }}>
        Primeiro: Cadastre os Atletas
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph sx={{ letterSpacing: '0.5px' }}>
        O primeiro passo como Gerente é cadastrar os{' '}
        <span style={{ fontWeight: 600, color: theme.palette.primary.main }}>Atletas</span> em suas
        respectivas categorias.
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
        {' '}
        <CustomButton variant="contained" onClick={handleNextStep}>
          Próximo{' '}
        </CustomButton>
      </Box>{' '}
    </Box>, // Passo 2 (Manager): Eventos e Despesas

    <Box key={2}>
      <Typography variant="h5" color="text.primary" gutterBottom sx={{ letterSpacing: '0.5px' }}>
        Em seguida: Eventos e Despesas
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph sx={{ letterSpacing: '0.5px' }}>
        Com os atletas cadastrados, você pode{' '}
        <span style={{ fontWeight: 600, color: theme.palette.primary.main }}>
          criar eventos e despesas{' '}
        </span>
        , que podem ser para eventos específicos ou despesas gerais.
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
        {' '}
        <CustomButton onClick={handleSkipTutorial} variant="contained">
          Finalizar{' '}
        </CustomButton>
      </Box>{' '}
    </Box>,
  ];

  return isOwner ? ownerSteps[step] : managerSteps[step];
};

function Welcome() {
  const theme = useTheme();
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Paper
        sx={{
          p: 4,
          mt: 4,
          backgroundColor: theme.palette.background.paper,
          boxShadow: theme.shadows[1],
        }}
      >
        {user?.role === 'ATHLETE' ? <AthleteTutorial /> : <AdminTutorial />}
      </Paper>{' '}
    </Box>
  );
}

export default Welcome;

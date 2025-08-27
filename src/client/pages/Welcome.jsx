import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, CircularProgress, Paper, Button, Divider } from '@mui/material';
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
  const tutorialRef = useRef(null);

  const handleNextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handleSkipTutorial = () => {
    navigate('/athlete-dashboard');
  };

  useEffect(() => {
    if (tutorialRef.current) {
      tutorialRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [step]);

  const steps = [
    // Passo 0: Introdução
    {
      title: 'E aí, Craque! 🏆',
      body: (
        <>
          Bem-vindo ao seu QG de atleta! Aqui, a gente te deixa no controle de tudo para você focar
          no que realmente importa: a próxima jogada! ⚽️{' '}
        </>
      ),
    }, // Passo 1: Dashboard
    {
      title: 'Dashboard: Visão do Jogo!',
      body: (
        <Typography variant="body1" color="text.secondary" sx={{ letterSpacing: '0.5px', mt: 5 }}>
          Aqui você vê os{' '}
          <span style={{ fontWeight: 600, color: theme.palette.primary.main }}>
            próximos eventos{' '}
          </span>{' '}
          e os{' '}
          <span style={{ fontWeight: 600, color: theme.palette.primary.main }}>
            pagamentos pendentes{' '}
          </span>{' '}
          num piscar de olhos. Basta um clique para{' '}
          <span style={{ fontWeight: 600, color: theme.palette.primary.main }}>
            confirmar sua presença{' '}
          </span>{' '}
          e mostrar que você está pronto pra ação!{' '}
        </Typography>
      ),
    }, // Passo 2: Pagamentos
    {
      title: 'Pagamentos: Missão PIX!',
      body: (
        <Typography variant="body1" color="text.secondary" sx={{ letterSpacing: '0.5px' }}>
          Tem um pagamento pendente? <br /> Sem problemas! É só clicar, selecionar a quantidade de
          itens que precisa pagar e{' '}
          <span style={{ fontWeight: 600, color: theme.palette.primary.main }}>
            copiar a chave PIX{' '}
          </span>{' '}
          com um botão super prático.{' '}
        </Typography>
      ),
    }, // Passo 3: Histórico
    {
      title: 'Históricos: Tudo na sua memória! 📊',
      body: (
        <Typography
          variant="body1"
          color="text.secondary"
          paragraph
          sx={{ letterSpacing: '0.5px' }}
        >
          Quer saber onde você esteve ou quais foram os seus gastos? <br /> Na seção de{' '}
          <span style={{ fontWeight: 600, color: theme.palette.primary.main }}>
            Histórico de Eventos{' '}
          </span>
          , você revisa todos os eventos passados e futuros. <br /> Em{' '}
          <span style={{ fontWeight: 600, color: theme.palette.primary.main }}>
            Histórico de Pagamentos{' '}
          </span>
          , todas as suas transações estão organizadas, para você nunca perder a conta.{' '}
        </Typography>
      ),
    },
  ];

  return (
    <Box ref={tutorialRef}>
      {' '}
      {steps.slice(0, step + 1).map((currentStep, index) => (
        <React.Fragment key={index}>
          {' '}
          <Box
            sx={{
              opacity: 0,
              animation: `fadeIn 0.5s ease-in-out ${index * 0.05}s forwards`,
              mt: index > 0 ? 4 : 0,
            }}
          >
            {' '}
            <Typography
              variant="h5"
              color="text.primary"
              gutterBottom
              sx={{ letterSpacing: '0.5px' }}
            >
              {currentStep.title}{' '}
            </Typography>{' '}
            <Typography
              variant="body1"
              color="text.secondary"
              paragraph
              sx={{ letterSpacing: '0.5px' }}
            >
              {currentStep.body}{' '}
            </Typography>{' '}
            {index === step && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2 }}>
                {' '}
                {step < steps.length - 1 && (
                  <Button variant="text" onClick={handleSkipTutorial}>
                    Pular Tutorial{' '}
                  </Button>
                )}{' '}
                {step < steps.length - 1 ? (
                  <CustomButton variant="contained" onClick={handleNextStep}>
                    Próximo{' '}
                  </CustomButton>
                ) : (
                  <CustomButton onClick={handleSkipTutorial} variant="contained">
                    Finalizar{' '}
                  </CustomButton>
                )}{' '}
              </Box>
            )}{' '}
            <style jsx>{`
              @keyframes fadeIn {
                from {
                  opacity: 0;
                  transform: translateY(20px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
            `}</style>{' '}
          </Box>
          {index < step && <Divider sx={{ my: 2, borderColor: theme.palette.divider }} />}{' '}
        </React.Fragment>
      ))}{' '}
    </Box>
  );
};

// Componente para o tutorial de Proprietário da Equipe e Gerentes
const AdminTutorial = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const [step, setStep] = useState(0);
  const tutorialRef = useRef(null);

  const isOwner = user?.role === undefined;

  const handleNextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handleSkipTutorial = () => {
    navigate('/analytics');
  };

  useEffect(() => {
    if (tutorialRef.current) {
      tutorialRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [step]);

  const ownerSteps = [
    // Passo 0 (Owner): Boas-vindas
    {
      title: 'Bem-vindo, Proprietário!',
      body: 'Este é o seu painel de controle para gerenciar a equipe e os eventos. Vamos começar!',
    }, // Passo 1 (Owner): Gerenciar Categorias
    {
      title: 'Primeiro: Gerenciar Categorias',
      body: (
        <>
          Como{' '}
          <span style={{ fontWeight: 600, color: theme.palette.primary.main }}>
            Proprietário da Equipe{' '}
          </span>
          , você é o único que pode{' '}
          <span style={{ fontWeight: 600, color: theme.palette.primary.main }}>
            criar e apagar as categorias{' '}
          </span>
          . Este é o primeiro passo essencial para organizar o time.{' '}
        </>
      ),
    }, // Passo 2 (Owner): Gerenciar Managers
    {
      title: 'Em seguida: Adicionar Gerentes',
      body: (
        <>
          Com as categorias criadas, você pode adicionar e gerenciar os{' '}
          <span style={{ fontWeight: 600, color: theme.palette.primary.main }}>
            Gerentes das Categorias.{' '}
          </span>{' '}
        </>
      ),
    }, // Passo 3 (Owner): Criar Atletas
    {
      title: 'Depois: Cadastre os Atletas',
      body: (
        <>
          Com os gerentes no lugar, é hora de cadastrar os{' '}
          <span style={{ fontWeight: 600, color: theme.palette.primary.main }}>Atletas</span> em
          suas respectivas categorias.{' '}
        </>
      ),
    }, // Passo 4 (Owner): Eventos e Despesas
    {
      title: 'Por fim: Eventos e Despesas',
      body: (
        <>
          Agora que a equipe está pronta, você pode{' '}
          <span style={{ fontWeight: 600, color: theme.palette.primary.main }}>
            criar eventos e despesas{' '}
          </span>
          , que podem ser para eventos específicos ou despesas gerais.{' '}
        </>
      ),
    }, // Passo 5 (Owner): Configurações e Senhas
    {
      title: 'Configurações e Senhas',
      body: (
        <>
          Lembre-se que, na seção de <SettingsIcon sx={{ fontSize: 20 }} />,{' '}
          <span style={{ fontWeight: 600, color: theme.palette.primary.main }}>
            você pode redefinir a senha{' '}
          </span>{' '}
          dos Gerentes e dos Atletas a qualquer momento. Você também pode{' '}
          <span style={{ fontWeight: 600, color: theme.palette.primary.main }}>
            baixar relatórios gerenciais{' '}
          </span>{' '}
          para acompanhar a saúde financeira e de eventos da sua equipe.{' '}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 2, fontStyle: 'italic', letterSpacing: '0.5px' }}
          >
            <span style={{ fontWeight: 600 }}>Atenção:</span> Por padrão, o usuário e a senha são
            definidos assim:{' '}
          </Typography>{' '}
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, letterSpacing: '0.5px' }}>
            - <span style={{ fontWeight: 600 }}>Usuário:</span> Número de telefone (ex: 11912345678,
            sem caracteres especiais).{' '}
          </Typography>{' '}
          <Typography variant="body2" color="text.secondary" sx={{ letterSpacing: '0.5px' }}>
            - <span style={{ fontWeight: 600 }}>Senha:</span> O primeiro nome do usuário seguido por
            `123`.{' '}
          </Typography>{' '}
        </>
      ),
    },
  ];

  const managerSteps = [
    // Passo 0 (Manager): Boas-vindas
    {
      title: 'Bem-vindo, Gerente!',
      body: 'Este é o seu painel de controle para gerenciar a equipe e os eventos. Vamos começar!',
    }, // Passo 1 (Manager): Criar Atletas
    {
      title: 'Primeiro: Cadastre os Atletas',
      body: (
        <>
          O primeiro passo como Gerente é cadastrar os{' '}
          <span style={{ fontWeight: 600, color: theme.palette.primary.main }}>Atletas</span> em
          suas respectivas categorias.{' '}
        </>
      ),
    }, // Passo 2 (Manager): Eventos e Despesas
    {
      title: 'Em seguida: Eventos e Despesas',
      body: (
        <>
          Com os atletas cadastrados, você pode{' '}
          <span style={{ fontWeight: 600, color: theme.palette.primary.main }}>
            criar eventos e despesas{' '}
          </span>
          , que podem ser para eventos específicos ou despesas gerais.{' '}
        </>
      ),
    },
  ];

  const steps = isOwner ? ownerSteps : managerSteps;

  return (
    <Box ref={tutorialRef}>
      {' '}
      {steps.slice(0, step + 1).map((currentStep, index) => (
        <React.Fragment key={index}>
          {' '}
          <Box
            sx={{
              opacity: 0,
              animation: `fadeIn 0.5s ease-in-out ${index * 0.05}s forwards`,
              mt: index > 0 ? 4 : 0,
            }}
          >
            {' '}
            <Typography
              variant="h5"
              color="text.primary"
              gutterBottom
              sx={{ letterSpacing: '0.5px' }}
            >
              {currentStep.title}{' '}
            </Typography>{' '}
            <Typography
              variant="body1"
              color="text.secondary"
              paragraph
              sx={{ letterSpacing: '0.5px' }}
            >
              {currentStep.body}{' '}
            </Typography>{' '}
            {index === step && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2 }}>
                {' '}
                {step < steps.length - 1 && (
                  <Button variant="text" onClick={handleSkipTutorial}>
                    Pular Tutorial{' '}
                  </Button>
                )}{' '}
                {step < steps.length - 1 ? (
                  <CustomButton variant="contained" onClick={handleNextStep}>
                    Próximo{' '}
                  </CustomButton>
                ) : (
                  <CustomButton onClick={handleSkipTutorial} variant="contained">
                    Finalizar{' '}
                  </CustomButton>
                )}{' '}
              </Box>
            )}{' '}
            <style jsx>{`
              @keyframes fadeIn {
                from {
                  opacity: 0;
                  transform: translateY(20px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
            `}</style>{' '}
          </Box>
          {index < step && <Divider sx={{ my: 2, borderColor: theme.palette.divider }} />}{' '}
        </React.Fragment>
      ))}{' '}
    </Box>
  );
};

function Welcome() {
  const theme = useTheme();
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />{' '}
      </Box>
    );
  }

  return (
    <Box>
      {' '}
      <Paper
        sx={{
          p: 4,
          mt: 4,
          backgroundColor: theme.palette.background.paper,
          boxShadow: theme.shadows[1],
        }}
      >
        {user?.role === 'ATHLETE' ? <AthleteTutorial /> : <AdminTutorial />}{' '}
      </Paper>{' '}
    </Box>
  );
}

export default Welcome;

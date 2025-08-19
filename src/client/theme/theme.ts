import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    // Cores primárias agora com um tom de azul mais vibrante e saturado
    primary: {
      main: '#1c88f3', // Um azul clássico e forte
      light: '#5eafff', // Uma versão mais clara para interações (hover, etc.)
      dark: '#1a6abb', // Uma versão mais escura para o fundo de botões pressionados
      contrastText: '#fff', // Texto branco para contraste
    },
    // As cores secundárias e de status permanecem as mesmas, pois estão corretas
    secondary: {
      main: '#52bc52',
      light: '#a1e8a1',
      dark: '#021d02',
      contrastText: '#000',
    },
    error: {
      main: '#c20a0a',
      light: '#fc9a8d',
      dark: '#1e0101',
      contrastText: '#fff',
    },
    // Cores de fundo
    background: {
      default: '#05070a',
      paper: '#0c1017',
    },
    // Cores do texto
    text: {
      primary: '#ffffff',
      secondary: '#94a0b8',
      disabled: 'rgba(255, 255, 255, 0.5)',
    },
  },
  typography: {
    fontFamily: "'Inter', 'Helvetica', 'Arial', sans-serif",
    h6: {
      fontWeight: 500,
    },
    subtitle1: {
      fontSize: '1rem',
    },
    subtitle2: {
      fontSize: '0.875rem',
    },
  },
  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e1e1e',
          color: '#fff',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow:
            '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
        },
      },
    },
  },
});

export default theme;

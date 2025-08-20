import AnalyticsIcon from '@mui/icons-material/AutoGraph';
import PaymentIcon from '@mui/icons-material/Payment';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SportsBaseballIcon from '@mui/icons-material/SportsBaseball';
import SettingsIcon from '@mui/icons-material/Settings';

const routesConfig = {
  '/analytics': {
    title: 'Analytics',
    icon: AnalyticsIcon,
  },
  '/athlete': {
    title: 'Gestão de Atletas',
    icon: SportsBaseballIcon,
  },
  '/payment': {
    title: 'Central de Despesas',
    icon: PaymentIcon,
  },
  '/event': {
    title: 'Central de Eventos',
    icon: EmojiEventsIcon,
  },
  '/setting': {
    title: 'Configuração',
    icon: SettingsIcon,
  },
};

export default routesConfig;

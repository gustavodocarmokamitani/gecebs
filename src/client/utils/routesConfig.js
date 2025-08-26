import AnalyticsIcon from '@mui/icons-material/AutoGraph';
import PaymentIcon from '@mui/icons-material/Payment';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SportsBaseballIcon from '@mui/icons-material/SportsBaseball';
import SettingsIcon from '@mui/icons-material/Settings';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import CategoryIcon from '@mui/icons-material/Category';
import LogoutIcon from '@mui/icons-material/Logout';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import HistoryIcon from '@mui/icons-material/History';
import HomeIcon from '@mui/icons-material/Home';

const routesConfig = {
  '/': {
    title: 'Home',
    icon: HomeIcon,
  },
  '/athelete-dashboard': {
    title: 'Dashboard',
    icon: SpaceDashboardIcon,
  },
  '/athelete-event-history': {
    title: 'Histórico de Eventos',
    icon: HistoryIcon,
  },
  '/athelete-payment-history': {
    title: 'Histórico de Despesas',
    icon: HistoryIcon,
  },
  '/analytics': {
    title: 'Analytics',
    icon: AnalyticsIcon,
  },
  '/category': {
    title: 'Gestão de Categorias',
    icon: CategoryIcon,
  },
  '/manager': {
    title: 'Gestão de Manager',
    icon: ManageAccountsIcon,
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
  '/logout': {
    title: 'Sair',
    icon: LogoutIcon,
  },
};

export default routesConfig;

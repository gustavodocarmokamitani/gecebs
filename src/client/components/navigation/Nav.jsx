import React from 'react';
import { Box, List, Divider, Drawer, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useResponsive } from '../../hooks/useResponsive';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/AuthContext';
import NavItem from './NavItem';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import AnalyticsIcon from '@mui/icons-material/AutoGraph';
import PaymentIcon from '@mui/icons-material/Payment';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SettingsIcon from '@mui/icons-material/Settings';
import SportsBaseballIcon from '@mui/icons-material/SportsBaseball';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import CategoryIcon from '@mui/icons-material/Category';
import LogoutIcon from '@mui/icons-material/Logout';
import HistoryIcon from '@mui/icons-material/History';
import HomeIcon from '@mui/icons-material/Home';

const drawerWidth = 305;

const Nav = ({ open, onClose }) => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const theme = useTheme();
  const deviceType = useResponsive();
  const isPermanent = deviceType === 'desktop';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAthlete = user?.role === 'ATHLETE';
  const isManager = user?.role === 'MANAGER';
  const isTeam = user?.role === 'TEAM';

  const renderNavItems = () => {
    if (isAthlete) {
      return (
        <List sx={{ p: 2 }}>
          <NavItem to="/" primary="Home" icon={HomeIcon} onClick={isPermanent ? null : onClose} />
          <NavItem
            to="/athlete-dashboard"
            primary="Dashboard"
            icon={SpaceDashboardIcon}
            onClick={isPermanent ? null : onClose}
          />
          <NavItem
            to="/athlete-event-history"
            primary="Histórico de Eventos"
            icon={HistoryIcon}
            onClick={isPermanent ? null : onClose}
          />
          <NavItem
            to="/athlete-payment-history"
            primary="Histórico de Despesas"
            icon={HistoryIcon}
            onClick={isPermanent ? null : onClose}
          />
          <NavItem
            to="/logout"
            primary="Sair"
            icon={LogoutIcon}
            onClick={() => {
              handleLogout();
              if (!isPermanent) {
                onClose();
              }
            }}
          />
        </List>
      );
    }

    return (
      <>
        <List sx={{ p: 2 }}>
          <NavItem to="/" primary="Home" icon={HomeIcon} onClick={isPermanent ? null : onClose} />
          <NavItem
            to="/analytics"
            primary="Analytics"
            icon={AnalyticsIcon}
            onClick={isPermanent ? null : onClose}
          />
          <NavItem
            to="/category"
            primary="Gestão de Categorias"
            icon={CategoryIcon}
            onClick={isPermanent ? null : onClose}
          />
          <NavItem
            to="/manager"
            primary="Gestão de Gerentes"
            icon={ManageAccountsIcon}
            onClick={isPermanent ? null : onClose}
          />
          <NavItem
            to="/athlete"
            primary="Gestão de Atletas"
            icon={SportsBaseballIcon}
            onClick={isPermanent ? null : onClose}
          />
          <NavItem
            to="/event"
            primary="Central de Eventos"
            icon={EmojiEventsIcon}
            onClick={isPermanent ? null : onClose}
          />
          <NavItem
            to="/payment"
            primary="Central de Despesas"
            icon={PaymentIcon}
            onClick={isPermanent ? null : onClose}
          />
        </List>
        <Divider sx={{ my: 1, borderColor: theme.palette.divider }} />
        <List sx={{ p: 2 }}>
          {!isAthlete && !isManager && (
            <NavItem
              to="/settings"
              primary="Settings"
              icon={SettingsIcon}
              onClick={isPermanent ? null : onClose}
            />
          )}
          <NavItem
            to="/logout"
            primary="Sair"
            icon={LogoutIcon}
            onClick={() => {
              handleLogout();
              if (!isPermanent) {
                onClose();
              }
            }}
          />
        </List>
      </>
    );
  };

  const drawerContent = (
    <Box
      sx={{
        width: drawerWidth,
        height: '100vh',
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.secondary,
      }}
    >
      <Box sx={{ p: 1, m: 1 }}>
        <Typography
          component="h5"
          variant="h5"
          gutterBottom
          align="center"
          color="primary"
          mt={1}
          sx={{ fontWeight: 600 }}
        >
          <Box component="span" color="primary.dark" sx={{ fontWeight: 100, fontStyle: 'italic' }}>
            Team
          </Box>{' '}
          Manager
        </Typography>
      </Box>
      <Divider sx={{ my: 1, borderColor: theme.palette.divider }} />

      {renderNavItems()}
    </Box>
  );

  return (
    <Drawer
      variant={isPermanent ? 'permanent' : 'temporary'}
      open={isPermanent ? true : open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true,
      }}
      sx={{
        display: isPermanent ? 'block' : 'block',
        '& .MuiDrawer-paper': {
          boxSizing: 'border-box',
          width: drawerWidth,
          overflowX: 'hidden',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Nav;

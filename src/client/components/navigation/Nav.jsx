import React from 'react';
import { Box, List, Divider, Drawer, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import AnalyticsIcon from '@mui/icons-material/AutoGraph';
import PaymentIcon from '@mui/icons-material/Payment';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SettingsIcon from '@mui/icons-material/Settings';
import SportsBaseballIcon from '@mui/icons-material/SportsBaseball';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import LogoutIcon from '@mui/icons-material/Logout';
import { useResponsive } from '../../hooks/useResponsive';
import NavItem from './NavItem';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/AuthContext';

const drawerWidth = 305;

const Nav = ({ open, onClose }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const theme = useTheme();
  const deviceType = useResponsive();
  const isPermanent = deviceType === 'desktop';

  const handleLogout = () => {
    logout();
    navigate('/login');
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

      {/* Itens do Menu */}
      <List sx={{ p: 2 }}>
        <NavItem
          to="/analytics"
          primary="Analytics"
          icon={AnalyticsIcon}
          onClick={isPermanent ? null : onClose}
        />
        <NavItem
          to="/manager"
          primary="Gestão de Manager"
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
          to="/payment"
          primary="Central de Despesas"
          icon={PaymentIcon}
          onClick={isPermanent ? null : onClose}
        />
        <NavItem
          to="/event"
          primary="Central de Eventos"
          icon={EmojiEventsIcon}
          onClick={isPermanent ? null : onClose}
        />
        {/* Outros itens podem ser adicionados aqui da mesma forma */}
      </List>

      <Divider sx={{ my: 1, borderColor: theme.palette.divider }} />

      <List sx={{ p: 2 }}>
        <NavItem
          to="/settings"
          primary="Settings"
          icon={SettingsIcon}
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

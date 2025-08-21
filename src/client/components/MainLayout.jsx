import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Nav from './navigation/Nav';
import { AppBar, Toolbar, IconButton, Typography, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useResponsive } from '../hooks/useResponsive';
import { useTheme } from '@mui/material/styles';
import routesConfig from '../utils/routesConfig';

const drawerWidth = 300;

const MainLayout = () => {
  const deviceType = useResponsive();
  const isMobile = deviceType === 'mobile';
  const isTablet = deviceType === 'tablet';
  const isDrawer = isMobile || isTablet;

  const [mobileOpen, setMobileOpen] = useState(false);

  const theme = useTheme();
  const location = useLocation();

  // --- Lógica Ajustada para Encontrar a Rota Principal ---
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const mainPath = `/${pathSegments[0]}`; // Pega o primeiro segmento da URL (e.g., '/athlete')

  const pageInfo = routesConfig[mainPath] || {};
  const pageTitle = pageInfo.title || 'Página Não Encontrada';
  const pageIcon = pageInfo.icon;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const renderPageIcon = () => {
    if (!pageIcon) return null;
    const IconComponent = pageIcon;
    return <IconComponent sx={{ mr: 1, color: theme.palette.text.primary }} />;
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* AppBar apenas no mobile */}
      {isDrawer && (
        <AppBar
          position="fixed"
          sx={{
            width: '100%',
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
          }}
        >
          <Toolbar>
            {renderPageIcon()}
            <Typography variant="subtitle1" noWrap component="div" sx={{ flexGrow: 1 }}>
              {pageTitle}
            </Typography>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="end"
              onClick={handleDrawerToggle}
              sx={{
                mr: 2,
                border: `1px solid ${theme.palette.text.secondary}`,
                borderRadius: 0.5,
              }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      )}

      {/* Nav: Drawer no mobile, Sidebar fixa no desktop */}
      <Box
        component="nav"
        sx={{
          width: isDrawer ? 0 : drawerWidth,
          flexShrink: 0,
        }}
      >
        <Nav open={isDrawer ? mobileOpen : true} onClose={handleDrawerToggle} />
      </Box>

      {/* Conteúdo principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          pt: isDrawer ? 8 : 4,
          width: isDrawer ? '100%' : `calc(100% - ${drawerWidth}px)`,
          backgroundColor: theme.palette.background.default,
          overflowX: 'hidden',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;

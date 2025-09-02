import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useLocation, Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

const NavItem = ({ to, primary, icon: IconComponent, onClick }) => {
  const theme = useTheme();
  const location = useLocation();
  const isSelected = location.pathname === to;

  return (
    <ListItemButton
      component={Link}
      to={to}
      selected={isSelected}
      onClick={onClick}
      sx={{
        borderRadius: 1,
        my: 1,
        '&.Mui-selected': {
          backgroundColor: theme.palette.primary.dark,
          color: theme.palette.primary.contrastText,
          boxShadow: '0px 4px 20px rgba(43, 43, 43, 0.9)',
          '& .MuiListItemIcon-root': {
            color: theme.palette.primary.contrastText,
          },
        },
        '&:hover': {
          backgroundColor: theme.palette.primary.dark,
          color: theme.palette.primary.contrastText,
          '& .MuiListItemIcon-root': {
            color: theme.palette.primary.contrastText,
          },
        },
      }}
    >
      <ListItemIcon sx={{ color: 'inherit' }}>
        <IconComponent />
      </ListItemIcon>
      <ListItemText primary={primary} />
    </ListItemButton>
  );
};

export default NavItem;

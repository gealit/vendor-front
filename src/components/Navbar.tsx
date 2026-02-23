import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import AdbIcon from '@mui/icons-material/Adb';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  title?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ title = 'Мониторинг продаж' }) => {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const getHomePath = () => {
    return isAuthenticated ? '/home' : '/main';
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          component={RouterLink}
          to={getHomePath()}
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <AdbIcon />
        </IconButton>

        <Typography
          variant="h6"
          component={RouterLink}
          to="/main"
          sx={{flexGrow: 1,
              textDecoration: 'none',
              color: 'inherit',
              cursor: 'pointer'}}
        >
          {title}
        </Typography>

        <Box>
          {isAuthenticated ? (
            <>
              <Button
                color="inherit"
                onClick={logout}
                variant={isActive('/logout') ? 'outlined' : 'text'}
              >
                Выйти
              </Button>
            </>
          ) : (
            <>
              <Button
                color="inherit"
                component={RouterLink}
                to="/login"
                variant={isActive('/login') ? 'outlined' : 'text'}
              >
                Войти
              </Button>
              <Button
                color="inherit"
                component={RouterLink}
                to="/signup"
                variant={isActive('/signup') ? 'outlined' : 'text'}
              >
                Регистрация
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AdbIcon from '@mui/icons-material/Adb';
import { Link as RouterLink } from 'react-router-dom'

export default function LoginAppBar( {path = '/'} ) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            component={RouterLink} to={path}
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <AdbIcon/>
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Мониторинг продаж
          </Typography>
          <Button color="inherit" component={RouterLink} to='/login'>Войти</Button>
          <Button color="inherit" component={RouterLink} to='/signup'>Регистрация</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
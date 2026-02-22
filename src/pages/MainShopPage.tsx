import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom'
import {
  Container,
  Typography,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  AppBar,
  Toolbar,
  Box,
  Alert,
  Snackbar,
} from '@mui/material';
import AdbIcon from '@mui/icons-material/Adb';
import IconButton from '@mui/material/IconButton';
import { useAuth } from '../context/AuthContext';


interface MainPageData {
  id: number;
  name: string;
  cost: number;
  // Add other fields from your backend
}

const MainShopPage: React.FC = () => {
  const [data, setData] = useState<MainPageData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, logout } = useAuth();
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');

  useEffect(() => {
    fetchMainPageData();
  }, [isAuthenticated]);

  const fetchMainPageData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('http://gealit.ru:8080/api', {
        credentials: 'include' // Important for cookies
      });

      if (!response.ok) {
        if (response.status === 401) {
          // If unauthorized, logout and redirect
          await logout();
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log("log from Main page: ",responseData)
      setData(responseData);
    } catch (err) {
      let errorMessage = 'Failed to fetch data';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleRefresh = async () => {
    await fetchMainPageData();
  };

  if (loading) {
    return (
      <Container maxWidth="md" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  const handleRowButtonClick = (rowId: number) => {
    const row = data.find(item => item.id === rowId);
    setSnackbarMessage(`Товар: "${row?.name}" Добавлен в корзину!`);
    setSnackbarOpen(true);

    // Your actual download logic here
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          {isAuthenticated ? (
            <IconButton
            component={RouterLink} to='/home'
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <AdbIcon/>
          </IconButton>
          ) : (
            <></>
          )}

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Welcome to Main Page
          </Typography>
          {isAuthenticated ? (
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          ) : (
            <>
            <Button color="inherit" component={RouterLink} to='/login'>Войти</Button>
            <Button color="inherit" component={RouterLink} to='/signup'>Регистрация</Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
        <Typography variant="h4" gutterBottom>
          Основная доска сайта, доступна не зарегистрированным пользователям.
        </Typography>

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
            action={
              <Button
                color="inherit"
                size="small"
                onClick={handleRefresh}
              >
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        <Button
          variant="contained"
          onClick={handleRefresh}
          sx={{ mb: 2 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Обновить данные'}
        </Button>
        <Button
          variant="contained"
          onClick={handleRefresh}
          sx={{ mb: 2, ml: 2 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Скачать данные'}
        </Button>

        <Paper elevation={3} style={{ padding: '2rem', marginBottom: '2rem' }}>
          <Typography variant="h6" gutterBottom>
            Тестовые данные для наглядности
          </Typography>

          {data.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Cost</TableCell>
                    {/* Add more headers as needed */}
                    <TableCell align="right"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.id}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.cost}</TableCell>
                      {/* Add more cells as needed */}
                      <TableCell align="right">
                      <Button
                      variant="contained"
                      onClick={() => handleRowButtonClick(row.id)}
                      disabled={loading}
                      /*sx={{ mb: 2, ml: 2 }}*/
                      >В корзину
                      </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body1">No data available</Typography>
          )}
            <Snackbar
              open={snackbarOpen}
              autoHideDuration={3000}
              onClose={handleCloseSnackbar}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
              <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                {snackbarMessage}
              </Alert>
            </Snackbar>
        </Paper>
      </Container>
    </Box>
  );
};

export default MainShopPage;
import React, { useState, useEffect } from 'react';
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
  Box,
  Alert,
  Snackbar,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';
import { mainService, MainPageData } from '../services/main.service';
import { ApiError } from '../services/api.service';

const MainShopPage: React.FC = () => {
  const [data, setData] = useState<MainPageData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    fetchMainPageData();
  }, []); // Убрали зависимость от isAuthenticated, чтобы избежать лишних запросов

  const fetchMainPageData = async () => {
    try {
      setLoading(true);
      setError(null);
      const responseData = await mainService.getMainData();
      setData(responseData);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        await logout();
      } else {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (rowId: number) => {
    const row = data.find(item => item.id === rowId);
    setSnackbarMessage(`Товар: "${row?.name}" добавлен в корзину!`);
    setSnackbarOpen(true);
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Box>
      <Navbar title="Главная страница" />

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Основная доска сайта, доступна не зарегистрированным пользователям
        </Typography>

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
            action={
              <Button color="inherit" size="small" onClick={fetchMainPageData}>
                Повторить
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        <Box sx={{ mb: 2 }}>
          <Button
            variant="contained"
            onClick={fetchMainPageData}
            disabled={loading}
            sx={{ mr: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Обновить данные'}
          </Button>
          <Button
            variant="contained"
            onClick={fetchMainPageData}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Скачать данные'}
          </Button>
        </Box>

        <Paper elevation={3} sx={{ p: 3 }}>
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
                    <TableCell align="right"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.id}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.cost}</TableCell>
                      <TableCell align="right">
                        <Button
                          variant="contained"
                          onClick={() => handleAddToCart(row.id)}
                        >
                          В корзину
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body1">Нет данных</Typography>
          )}
        </Paper>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={() => setSnackbarOpen(false)} severity="success">
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default MainShopPage;
import React, { useState, useEffect, useContext } from 'react';
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
  Alert
} from '@mui/material';
import AdbIcon from '@mui/icons-material/Adb';
import IconButton from '@mui/material/IconButton';
import { useAuth } from '../context/AuthContext';

interface HomeData {
  id: number;
  name: string;
  email: string;
  // Add other fields from your backend
}

const MainShopPage: React.FC = () => {
  const [data, setData] = useState<HomeData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, login, logout, checkAuth } = useAuth();

  useEffect(() => {
    fetchMainPageData();
  }, [isAuthenticated]);

  const fetchMainPageData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('http://localhost:8080', {
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
    await checkAuth(); // Verify auth status first
    if (isAuthenticated) {
      await fetchMainPageData();
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

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
          Dashboard
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
          {loading ? <CircularProgress size={24} /> : 'Refresh Data'}
        </Button>

        <Paper elevation={3} style={{ padding: '2rem', marginBottom: '2rem' }}>
          <Typography variant="h6" gutterBottom>
            Your Data
          </Typography>

          {data.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    {/* Add more headers as needed */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.id}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.email}</TableCell>
                      {/* Add more cells as needed */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body1">No data available</Typography>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default MainShopPage;
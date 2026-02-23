import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Paper,
  Avatar,
  Typography,
  Box,
  TextField,
  Button,
  Link,
  Alert,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockClockOutlined';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { LoginCredentials } from '../services/auth.service';

const LoginPage = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const validateForm = (): boolean => {
    if (!formData.email.trim()) {
      setError('Введите email');
      return false;
    }
    if (!formData.password.trim()) {
      setError('Введите пароль');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Введите корректный email');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setError('');

    try {
      await login(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка входа');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="xs">
        <Paper
          elevation={3}
          sx={{
            marginTop: 8,
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>

          <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
            Вход в систему
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              name="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              autoFocus
              disabled={isLoading}
            />

            <TextField
              name="password"
              label="Пароль"
              type="password"
              value={formData.password}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              disabled={isLoading}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading}
            >
              {isLoading ? 'Вход...' : 'Войти'}
            </Button>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Link component={RouterLink} to="/forgot" variant="body2">
                Забыли пароль?
              </Link>
              <Link component={RouterLink} to="/signup" variant="body2">
                Нет аккаунта? Регистрация
              </Link>
            </Box>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default LoginPage;
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
import { SignupCredentials } from '../services/auth.service';

const SignupPage = () => {
  const { signup } = useAuth();
  const [formData, setFormData] = useState<SignupCredentials>({
    username: '',
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const validateForm = (): boolean => {
    if (!formData.username.trim()) {
      setError('Введите имя пользователя');
      return false;
    }
    if (formData.username.length < 3) {
      setError('Имя пользователя должно содержать минимум 3 символа');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Введите email');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Введите корректный email');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      await signup(formData);
      setSuccess('Регистрация успешна! Перенаправление на страницу входа...');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка регистрации');
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
            Регистрация
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
              {success}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              name="username"
              label="Имя пользователя"
              value={formData.username}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              autoFocus
              disabled={isLoading}
              helperText="Минимум 3 символа"
            />

            <TextField
              name="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
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
              helperText="Минимум 6 символов"
              disabled={isLoading}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading}
            >
              {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
            </Button>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
              <Link component={RouterLink} to="/login" variant="body2">
                Уже есть аккаунт? Войти
              </Link>
            </Box>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default SignupPage;
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginAppBar from '../components/MuiNavbar'
import {Container, Paper, Avatar, Typography, Box, TextField, Button, Grid, Link} from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockClockOutlined'
import { useAuth } from '../context/AuthContext'
import { Link as RouterLink } from 'react-router-dom'

interface FormData {
  username: string;
  email: string;
  password: string;
}

const SignupPage = () => {
  const { isAuthenticated } = useAuth();

  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
  // Redirect if not authenticated
  if (isAuthenticated) {
      navigate('/');
      return;
  }
  }, [isAuthenticated, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const submitCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('https://gealit.ru/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const data = await response.json();
      console.log('Registration successful:', data);
      // Redirect to login page after successful registration
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <LoginAppBar />
      <Container maxWidth='xs'>
        <Paper elevation={10} sx={{ marginTop: 8, padding: 2 }}>
          <Avatar sx={{
              mx: 'auto',
              bgcolor: 'secondary.main',
              textAlign: 'center',
              mb: 1,
          }}>
              <LockOutlinedIcon />
          </Avatar>
          <Typography component='h1' variant='h5' sx={{ textAlign: 'center' }}>
              Введите данные для регистрации
          </Typography>

          {error && (
            <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
              {error}
            </Typography>
          )}

          <Box component='form' method='post' onSubmit={submitCredentials} noValidate sx={{ mt: 1 }}>
            <TextField
              name="username"
              placeholder='Введите username'
              fullWidth
              required
              autoFocus
              sx={{ mb: 2 }}
              value={formData.username}
              onChange={handleChange}
            />
            <TextField
              name="email"
              placeholder='Введите почту'
              fullWidth
              required
              sx={{ mb: 2 }}
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              name="password"
              placeholder='Введите пароль'
              fullWidth
              required
              type='password'
              sx={{ mb: 2 }}
              value={formData.password}
              onChange={handleChange}
            />
            <Button
              type='submit'
              variant='contained'
              fullWidth
              sx={{ mt: 1 }}
              disabled={isLoading}
            >
              {isLoading ? 'Загрузка...' : 'Зарегистрироваться'}
            </Button>
          </Box>

          <Grid container justifyContent='space-between' sx={{ mt: 1 }}>
            <Grid>
                <Link component={RouterLink} to='/forgot'>
                    Забыли пароль
                </Link>
            </Grid>
            <Grid>
                <Link component={RouterLink} to='/login'>
                    Войти
                </Link>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </div>
  );
};

export default SignupPage
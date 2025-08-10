import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom'
import {Container, Paper, Avatar, Typography, Box, TextField, Button, Grid, Link} from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockClockOutlined'

import { useAuth } from '../context/AuthContext'
import LoginAppBar from '../components/MuiNavbar'


interface FormData {
  // username: string;
  email: string;
  password: string;
}

const LoginPage = () => {
    const { isAuthenticated, login} = useAuth();
    const [formData, setFormData] = useState<FormData>({
        email: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
    // Redirect if not authenticated
    if (isAuthenticated) {
        navigate('/home');
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
            const response = await fetch('http://gealit.ru:3680/api/login', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
                credentials: 'include'
            });

            if (response.ok) {
                login();
            } else {
                const errorData = await response.json();
                console.log('Login error:', errorData);
                throw new Error(errorData.message || 'Login failed');
            }

            const data = await response.json();
            console.log('Login successful:', data);
            // Redirect to login page after successful registration
            // navigate('/home');
            } catch (error) {
            console.error('Login error:', error);
            console.log(document.cookie)
            setError(error instanceof Error ? error.message : 'An unknown error occurred');
            } finally {
            setIsLoading(false);
        }
    };

    return (
    <div>
    <LoginAppBar></LoginAppBar>
    <Container maxWidth='xs'>
      <Paper elevation={10} sx={{ marginTop: 8, padding: 2}}>
        <Avatar sx={{
            mx: 'auto',
            bgcolor: 'secondary.main',
            textAlign: 'center',
            mb: 1,
        }}>
            <LockOutlinedIcon/>
        </Avatar>
        <Typography component='h1' variant='h5' sx={{ textAlign: 'center' }}>
            Введите данные для входа
        </Typography>
        {error && (
        <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
            {error}
        </Typography>
        )}
        <Box component='form' method='post' onSubmit={submitCredentials} noValidate sx={{mt: 1}}>
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
            <Button type='submit' variant='contained' fullWidth sx={{ mt: 1 }} disabled={isLoading}>
                {isLoading ? 'Загрузка...' : 'Войти'}
            </Button>
        </Box>
        <Grid container justifyContent='space-between' sx={{ mt: 1 }}>
            <Grid>
                <Link component={RouterLink} to='/forgot'>
                    Забыли пароль
                </Link>
            </Grid>
            <Grid>
                <Link component={RouterLink} to='/signup'>
                    Регистрация
                </Link>
            </Grid>
        </Grid>
      </Paper>
    </Container>
    </div>
    )
}

export default LoginPage